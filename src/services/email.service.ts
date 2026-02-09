import { Booking } from "@prisma/client";
import { sendEmail, EmailOptions } from "@/lib/mail";
import { logger } from "@/lib/logger";
import { EMAIL_CONFIG } from "@/lib/contants";
import { formatDateForDisplay, formatTimeForDisplay } from "@/lib/date-utils";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export async function sendAdminBookingNotification(booking: Booking): Promise<void> {
  logger.info("Sending admin notification", { bookingId: booking.id });

  const subject = `New Booking Request - ${booking.customerName}`;
  const html = generateAdminNotificationTemplate(booking);
  const text = generateAdminNotificationText(booking);

  await sendWithRetry({
    to: EMAIL_CONFIG.ADMIN_EMAIL,
    subject,
    html,
    text,
  });
}

export async function sendCustomerAcceptanceEmail(booking: Booking): Promise<void> {
  logger.info("Sending customer acceptance email", { bookingId: booking.id });

  const subject = "Booking Confirmed - Prarthana Nelum Pokuna";
  const html = generateAcceptanceTemplate(booking);
  const text = generateAcceptanceText(booking);

  await sendWithRetry({
    to: booking.customerEmail,
    subject,
    html,
    text,
  });
}

export async function sendCustomerRejectionEmail(booking: Booking): Promise<void> {
  logger.info("Sending customer rejection email", { bookingId: booking.id });

  const subject = "Booking Update - Prarthana Nelum Pokuna";
  const html = generateRejectionTemplate(booking);
  const text = generateRejectionText(booking);

  await sendWithRetry({
    to: booking.customerEmail,
    subject,
    html,
    text,
  });
}

async function sendWithRetry(options: EmailOptions): Promise<void> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await sendEmail(options);
      return; // Success
    } catch (error) {
      lastError = error as Error;
      logger.warn(`Email send attempt ${attempt} failed`, error);

      if (attempt < MAX_RETRIES) {
        await delay(RETRY_DELAY * attempt);
      }
    }
  }

  // All retries failed
  logger.error("Failed to send email after all retries", lastError);
  // Don't throw - we don't want email failures to break the booking flow
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateAdminNotificationTemplate(booking: Booking): string {
    const eventDate = formatDateForDisplay(booking.eventDate);
    const startTime = formatTimeForDisplay(booking.startTime);
    const endTime = formatTimeForDisplay(booking.endTime);

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2c5282; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f7fafc; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; color: #2c5282; }
            .footer { margin-top: 20px; padding: 20px; text-align: center; font-size: 12px; color: #718096; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Booking Request</h1>
            </div>
            <div class="content">
              <p>You have received a new booking request:</p>
              
              <div class="info-row">
                <span class="label">Booking ID:</span> ${booking.id}
              </div>
              <div class="info-row">
                <span class="label">Customer Name:</span> ${booking.customerName}
              </div>
              <div class="info-row">
                <span class="label">Email:</span> ${booking.customerEmail}
              </div>
              <div class="info-row">
                <span class="label">Phone:</span> ${booking.customerPhone}
              </div>
              <div class="info-row">
                <span class="label">Function Type:</span> ${booking.functionTypeLabel || "N/A"}
              </div>
              <div class="info-row">
                <span class="label">Event Date:</span> ${eventDate}
              </div>
              <div class="info-row">
                <span class="label">Time:</span> ${startTime} - ${endTime}
              </div>
              ${
                booking.additionalNotes
                  ? `<div class="info-row">
                      <span class="label">Notes:</span> ${booking.additionalNotes}
                    </div>`
                  : ""
              }
              
              <p style="margin-top: 20px;">
                Please log in to the admin dashboard to accept or reject this booking.
              </p>
            </div>
            <div class="footer">
              <p>Prarthana Nelum Pokuna - Booking Management System</p>
            </div>
          </div>
        </body>
      </html>
    `;
}

function generateAdminNotificationText(booking: Booking): string {
    return `
        New Booking Request

        Booking ID: ${booking.id}
        Customer: ${booking.customerName}
        Email: ${booking.customerEmail}
        Phone: ${booking.customerPhone}
        Function Type: ${booking.functionTypeLabel || "N/A"}
        Event Date: ${formatDateForDisplay(booking.eventDate)}
        Time: ${formatTimeForDisplay(booking.startTime)} - ${formatTimeForDisplay(booking.endTime)}
        ${booking.additionalNotes ? `Notes: ${booking.additionalNotes}` : ""}

        Please log in to the admin dashboard to accept or reject this booking.
    `.trim();
}

function generateAcceptanceTemplate(booking: Booking): string {
    const eventDate = formatDateForDisplay(booking.eventDate);
    const startTime = formatTimeForDisplay(booking.startTime);
    const endTime = formatTimeForDisplay(booking.endTime);

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #22543d; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f0fff4; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; color: #22543d; }
            .success { background-color: #c6f6d5; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { margin-top: 20px; padding: 20px; text-align: center; font-size: 12px; color: #718096; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmed!</h1>
            </div>
            <div class="content">
              <div class="success">
                <strong>Great news!</strong> Your booking has been confirmed.
              </div>
              
              <p>Dear ${booking.customerName},</p>
              <p>We are pleased to confirm your booking at Prarthana Nelum Pokuna.</p>
              
              <h3>Booking Details:</h3>
              <div class="info-row">
                <span class="label">Booking Reference:</span> ${booking.id}
              </div>
              <div class="info-row">
                <span class="label">Function Type:</span> ${booking.functionTypeLabel || "N/A"}
              </div>
              <div class="info-row">
                <span class="label">Event Date:</span> ${eventDate}
              </div>
              <div class="info-row">
                <span class="label">Time:</span> ${startTime} - ${endTime}
              </div>
              ${
                booking.adminNote
                  ? `<div class="info-row">
                      <span class="label">Note from us:</span> ${booking.adminNote}
                    </div>`
                  : ""
              }
              
              <p style="margin-top: 20px;">
                If you have any questions, please contact us at:<br>
                Phone: 0773630458<br>
                Email: nelumpokuna@gmail.com
              </p>
              
              <p>We look forward to hosting your event!</p>
            </div>
            <div class="footer">
              <p>Prarthana Nelum Pokuna</p>
              <p>Prarthana, Bulugolla-Dombemada-Wahawa Rd, Pothuhera</p>
            </div>
          </div>
        </body>
      </html>
    `;
}

function generateAcceptanceText(booking: Booking): string {
    return `
Booking Confirmed!

Dear ${booking.customerName},

We are pleased to confirm your booking at Prarthana Nelum Pokuna.

Booking Details:
Reference: ${booking.id}
Function Type: ${booking.functionTypeLabel || "N/A"}
Event Date: ${formatDateForDisplay(booking.eventDate)}
Time: ${formatTimeForDisplay(booking.startTime)} - ${formatTimeForDisplay(booking.endTime)}
${booking.adminNote ? `Note: ${booking.adminNote}` : ""}

Contact us:
Phone: 0773630458
Email: nelumpokuna@gmail.com

We look forward to hosting your event!

Prarthana Nelum Pokuna
Prarthana, Bulugolla-Dombemada-Wahawa Rd, Pothuhera
    `.trim();
}

function generateRejectionTemplate(booking: Booking): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #742a2a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #fffaf0; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; }
            .footer { margin-top: 20px; padding: 20px; text-align: center; font-size: 12px; color: #718096; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Update</h1>
            </div>
            <div class="content">
              <p>Dear ${booking.customerName},</p>
              <p>Thank you for your interest in Prarthana Nelum Pokuna.</p>
              <p>Unfortunately, we are unable to confirm your booking for the requested date and time.</p>
              
              ${
                booking.adminNote
                  ? `<div style="background-color: #fed7d7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                      <strong>Reason:</strong> ${booking.adminNote}
                    </div>`
                  : ""
              }
              
              <p>We apologize for any inconvenience. Please feel free to contact us to discuss alternative dates or arrangements:</p>
              <p>
                Phone: 0773630458<br>
                Email: nelumpokuna@gmail.com
              </p>
            </div>
            <div class="footer">
              <p>Prarthana Nelum Pokuna</p>
              <p>Prarthana, Bulugolla-Dombemada-Wahawa Rd, Pothuhera</p>
            </div>
          </div>
        </body>
      </html>
    `;
}

function generateRejectionText(booking: Booking): string {
    return `
Booking Update

Dear ${booking.customerName},

Thank you for your interest in Prarthana Nelum Pokuna.

Unfortunately, we are unable to confirm your booking for the requested date and time.

${booking.adminNote ? `Reason: ${booking.adminNote}` : ""}

We apologize for any inconvenience. Please contact us to discuss alternatives:
Phone: 0773630458
Email: nelumpokuna@gmail.com

Prarthana Nelum Pokuna
Prarthana, Bulugolla-Dombemada-Wahawa Rd, Pothuhera
    `.trim();
}
