import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import QRCode from "qrcode";

// Tạo mã QR thanh toán ngân hàng
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { booking_id } = body;

    if (!booking_id) {
      return NextResponse.json(
        { error: "Thiếu booking_id" },
        { status: 400 }
      );
    }

    // Lấy thông tin booking
    const booking = await prisma.bookings.findUnique({
      where: { id: BigInt(booking_id) },
      include: {
        user: true,
        showtime: {
          include: {
            movie: true,
            screen: { include: { branch: true } },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn đặt vé" },
        { status: 404 }
      );
    }

    // Kiểm tra quyền truy cập
    if (booking.user_id && Number(booking.user_id) !== user.id) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 403 }
      );
    }

    // Kiểm tra đã thanh toán chưa
    if (booking.payment_status === "paid") {
      return NextResponse.json(
        { error: "Đơn hàng đã được thanh toán" },
        { status: 400 }
      );
    }

    // Tạo transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Thông tin tài khoản ngân hàng (có thể lấy từ env hoặc database)
    const bankAccount = process.env.BANK_ACCOUNT || "1234567890";
    const bankName = process.env.BANK_NAME || "Ngân hàng TMCP Á Châu (ACB)";
    const accountName = process.env.ACCOUNT_NAME || "LMK CINEMA";

    // Tạo nội dung QR (theo format VietQR hoặc ngân hàng)
    const qrData = {
      accountNo: bankAccount,
      accountName: accountName,
      amount: Number(booking.total_amount),
      addInfo: `LMK-${booking.booking_code}`,
      template: "compact2",
    };

    // Tạo chuỗi QR data (format VietQR)
    const qrString = `00020101021238570010A00000072701270006${bankAccount}0108${accountName}0208QRIBFTTA5303704540${Number(booking.total_amount)}5802VN62${qrData.addInfo.length.toString().padStart(2, '0')}${qrData.addInfo}6304`;

    // Tạo QR code image
    let qrCodeImage;
    try {
      qrCodeImage = await QRCode.toDataURL(qrString, {
        errorCorrectionLevel: "M",
        type: "image/png",
        width: 300,
        margin: 2,
      });
    } catch (error) {
      // Fallback: tạo QR với thông tin đơn giản hơn
      const simpleQRString = `${bankAccount}|${accountName}|${Number(booking.total_amount)}|${booking.booking_code}`;
      qrCodeImage = await QRCode.toDataURL(simpleQRString, {
        errorCorrectionLevel: "M",
        type: "image/png",
        width: 300,
        margin: 2,
      });
    }

    // Thời gian hết hạn: 15 phút
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Tạo payment record
    const payment = await prisma.payments.create({
      data: {
        booking_id: BigInt(booking_id),
        transaction_id: transactionId,
        amount: booking.total_amount,
        bank_account: bankAccount,
        bank_name: bankName,
        qr_code: qrCodeImage,
        qr_data: qrString,
        payment_method: "bank_transfer",
        status: "pending",
        expires_at: expiresAt,
      },
    });

    // Cập nhật booking
    await prisma.bookings.update({
      where: { id: BigInt(booking_id) },
      data: {
        transaction_id: transactionId,
        qr_code: qrCodeImage,
        qr_expires_at: expiresAt,
        payment_method: "bank_transfer",
      },
    });

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id.toString(),
        transaction_id: transactionId,
        qr_code: qrCodeImage,
        qr_data: qrString,
        amount: Number(booking.total_amount),
        bank_account: bankAccount,
        bank_name: bankName,
        account_name: accountName,
        expires_at: expiresAt.toISOString(),
        booking_code: booking.booking_code,
      },
    });
  } catch (error) {
    console.error("Error creating QR code:", error);
    return NextResponse.json(
      { error: "Lỗi tạo mã QR thanh toán" },
      { status: 500 }
    );
  }
}




