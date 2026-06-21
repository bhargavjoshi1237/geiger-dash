"use server";

export async function submitContactForm(formData) {
  const fullName = formData.get("fullName")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const company = formData.get("company")?.toString().trim();
  const teamSize = formData.get("teamSize")?.toString().trim();
  const inquiryType = formData.get("inquiryType")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  if (!fullName || !email || !company || !teamSize || !inquiryType || !message) {
    return { error: "All fields are required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  // Log the submission for now — wire up an email/CRM provider here when ready
  console.log("[contact-sales]", { fullName, email, company, teamSize, inquiryType, message });

  return { success: true };
}
