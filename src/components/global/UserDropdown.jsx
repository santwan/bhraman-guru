// components/UserDropdown.jsx
import { UserButton } from "@clerk/clerk-react";

const UserDropdown = () => {
  return (
    <UserButton
      appearance={{
        elements: {
          userButtonPopoverFooter: "hidden",
        },
      }}
      afterSignOutUrl="/"
      userProfileMode="navigation"
      userProfileUrl="/account"
      additionalNavigationLinks={[
        {
          label: "My Trips",
          href: "/my-trip-history", // ✅ Your custom route
        },
      ]}
    />
  );
};

export default UserDropdown;
