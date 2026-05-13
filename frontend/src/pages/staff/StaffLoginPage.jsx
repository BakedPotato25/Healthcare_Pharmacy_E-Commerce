import PlaceholderPage from "../../components/common/PlaceholderPage.jsx";

export default function StaffLoginPage() {
  return (
    <PlaceholderPage
      title="Staff Login"
      description="Placeholder for staff authentication. Staff access will remain separate from customer login."
      role="Staff"
      route="/staff/login"
      nextReference="staff_portal_login_pharmacare"
    />
  );
}
