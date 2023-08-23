const UrlServices = {
  //auth.js
  login: "client/login",
  resendEmail: "/signup/resend-email/",
  signUp: "/register/",
  selectWorkspace: "/workspace/by-id/",
  getUsers: "/user/",
  getWorkspaces: "/workspace/",
  getTickets: "/ticket",
  getWorkspacesForSpecificUser: "/user-workspaces/by-user-id",
  forgotPassword: "/forget-password",
  resetPassword: "/reset-password",
  //ticket.js
  getAllMessagesByTicketId: "message/by-ticket-id",
  updateFaq: "faq/",
  getFaq: "faq",
  getTasks: "ticket/by-workspace-id/",
  setTicketAsReadable: "ticket/mark-as-read",
  //user.js
  addUserWorkspaces: "/userWorkspaces/assignUser",
  getworkspacesWithFilter: "workspace/byFilter/",
  getWorkspaces: "workspace/",
  createUser: "/user/",
  deleteUser: "/user/",
  unAssignWorkspace: "/userWorkspaces/unassignUser",
  //xeroForm.js
  getInvoices: "xero/ocr/fileUrl",
  submitInvoices: "/xero/submit/",
  disconnectXero: "xero/disconnect",
  // Verification.vue
  verification: "signup/verify",
  //ListAllinWorkspace.vue
  ListAllinWorkspace: "/userWorkspaces/byWorkspaceIdAndRole",
  // DataTable.vue
  getTicketDetails: "ticket/by-id/",
  //CompleteStatusDialog.vue
  changeStatus: "ticket/updateStatus/",
  //CreateTicket.vue
  createTicket: "ticket/",
  ticketTypes: "/ticket-types/",
  // CreateWorkspace.vue
  createWorkspace: "workspace/",

  //TicketDetails.vue
  slack: "slack",
  // TicketDetailsFooter
  sendMessage: "slack/add-message/",
  // Employee Management
  employee: "user/employee",
  updateEmployee: "user/client/update-employee",
  // Update user
  updateUser: "user/update-profile",
  //update workspace
  updateWorkspace: "workspace/update-workspace-name",
  // Review Ticket
  reviewTicket: "/ticket/review/",

  // Dashboard
  ticketStats: "workspace/ticket-stats",
  ticketGraph: "workspace/ticket-graph",
  employeeStats: "workspace/employee-stats",

  // get Audit Tickets
  auditTickets: "workspace/audit-tickets/",

  // audit ticket Request
  updatedAuditTicketStatus: "/ticket/update-audit-ticket-status/",
  // enable/disable audit
  enableDisableAudit: "/workspace/audit-ticket-approval",
  invoiceEdit: "/workspace/rewrite-invoice",

  // user feedback
  userFeedback: "/user/feedback",

  // login Verification
  loginVerification: "/client/verification",

  // Get Profile
  getProfile: "/user/get-profile",

  // Set profile picture of the workspace
  updateProfilePicture: "/workspace/profile-picture",

  // Get Branding Themes
  getBrandingThemes: "/xero/get-branding-themes",

  // firstTimelogin key for tour guide
  updateFirstLogin: "/user/update-first-login",
  // Create Accounts to Xero
  createAccountsToXero: "xero/create-accounts-to-xero",
  // xero currencies
  xeroCurrencies: "/xero/currencies",
  // Get all Accounts and Items
  getTotalAccountItems: "xero/total-items-accounts",
};

export default UrlServices;
