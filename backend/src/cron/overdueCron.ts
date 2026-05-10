import cron from 'node-cron';
import prisma from '../config/prisma';
import nodemailer from 'nodemailer';

// Mock Nodemailer configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'ethereal.user@ethereal.email', // Replace with real credentials in production
    pass: 'ethereal_password'
  }
});

// Run daily at midnight '0 0 * * *'
// Using '0 0 * * *' runs at 00:00 every day
export const startCronJobs = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running overdue check cron job...');
    try {
      const now = new Date();
      
      // Find all approved requests where return date is passed
      const overdueRequests = await prisma.borrowRequest.findMany({
        where: {
          status: 'APPROVED',
          returnDate: {
            lt: now
          }
        },
        include: {
          student: true,
          equipment: true
        }
      });

      for (const request of overdueRequests) {
        // Update status to OVERDUE
        await prisma.borrowRequest.update({
          where: { id: request.id },
          data: { status: 'OVERDUE' }
        });

        // Send warning email
        const mailOptions = {
          from: '"CLB Admin" <admin@clb.com>',
          to: request.student.email,
          subject: 'Warning: Overdue Equipment Return',
          text: `Hello ${request.student.fullName},\n\nYou have an overdue equipment return for "${request.equipment.name}".\nPlease return it as soon as possible.\n\nThank you!`
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Sent overdue warning to ${request.student.email}`);
        } catch (emailError) {
          console.error(`Failed to send email to ${request.student.email}:`, emailError);
        }
      }
      
      console.log(`Overdue check complete. Processed ${overdueRequests.length} requests.`);
    } catch (error) {
      console.error('Error in overdue cron job:', error);
    }
  });
};
