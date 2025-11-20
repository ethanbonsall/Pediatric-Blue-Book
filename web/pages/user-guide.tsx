// app/user-guide/page.tsx

import Navbar from "@/components/navbar-profile";
import React from "react";

export default function UserGuidePage() {
  const website = "https://pediatricbluebook.com";
  return (
    <main className="min-h-screen bg-background text-black mb-8">
      <Navbar />
      <div className="max-w-5xl mx-auto space-y-16 mt-8">
        {/* Section Header */}
        <header className="space-y-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-black">
            Pediatric Blue Book User Guide
          </h1>
          <p className="text-secondary max-w-2xl mx-auto text-sm md:text-base">
            A walkthrough of how to sign up, calculate nutrient needs, use the
            formula calculator, and manage your account.
          </p>
        </header>

        {/* --- Regular User Guide Section --- */}
        <section className="bg-gray-100 border border-secondary rounded-xl p-6 md:p-10 space-y-8">
          <h2 className="text-2xl font-semibold text-black">
            Regular User Guide
          </h2>

          <div className="space-y-6 text-sm md:text-base leading-relaxed text-black">
            <p>
              Start by clicking the{" "}
              <span className="font-semibold text-black">Sign Up</span> page.
              Enter all required information about yourself, read the agreement,
              and then click the checkbox to accept it.
            </p>

            <p>
              Next you will enter all of your child’s information. After all
              fields are completed, click
              <span className="font-semibold text-black"> Calculate</span>. The
              nutrient results will populate automatically. You can print these
              nutrients using the built-in print button.
            </p>

            <p>
              Scroll down to the{" "}
              <span className="font-semibold text-black">
                Formula Calculator
              </span>
              . Use the search box to find available formulas and add-ins. You
              can filter the list using the ingredient type dropdown.
            </p>

            <p>
              Once selected, the fields on the right side will populate with
              nutrient information. If any nutrient field appears{" "}
              <span className="text-red-600 font-semibold">red</span>, that
              indicates the ingredient provides less than 67% of the recommended
              DRI.
            </p>

            <p>
              You can add multiple ingredients. Click the{" "}
              <span className="font-semibold text-black">plus (+) button </span>
              to add an ingredient. A pop-up will appear where you can change
              the ingredient amount or the measurement unit.
            </p>

            <p>
              Scrolling further down, you will find another section dedicated to
              searching ingredients without selecting anything.
            </p>

            <p>
              To log out or delete your account, click the{" "}
              <span className="font-semibold text-black">user icon</span> in the
              top-right corner. Select{" "}
              <span className="font-semibold">Logout</span> to end your session,
              or <span className="font-semibold">Delete Account</span> to
              permanently remove your account. To edit your account details,
              click <span className="font-semibold">Edit</span>, adjust your
              information, and click
              <span className="font-semibold"> Save</span>.
            </p>
          </div>

          {/* Video Placeholder */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-black mb-4">
              Tutorial Video
            </h3>

            <div className="aspect-video w-full rounded-xl border border-secondary overflow-hidden bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/mPZxNlJwaKs"
                title="Tutorial Video Placeholder"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
        {/* --- Admin Guide Section --- */}
        <section className="bg-secondary/10 border border-secondary rounded-xl p-6 md:p-10 space-y-8">
          <h2 className="text-2xl font-semibold text-black">Admin Guide</h2>

          <div className="space-y-6 text-sm md:text-base leading-relaxed text-black">
            <p>
              If you are new, read through the regular user section above to
              understand the basics of navigating the site and using the
              calculators. Admins have all user abilities plus access to the
              <span className="font-semibold text-black"> Admin Panel</span>,
              which appears at the top of the site.
            </p>

            <p>
              To add a new ingredient, go to the Admin Panel and click the
              <span className="font-semibold text-black"> Add Entry</span>{" "}
              button. A form will appear allowing you to input all required
              information about the ingredient.
            </p>

            <p>
              To edit an ingredient, click the{" "}
              <span className="font-semibold text-black">pencil icon</span>.
              This will open an editable form where you can update that
              ingredient’s information.
            </p>

            <p>
              You can sort ingredients alphabetically{" "}
              <span className="font-semibold">A–Z</span> or{" "}
              <span className="font-semibold">Z–A</span>, and you can sort by
              ingredient type. You can also filter ingredients by:
            </p>

            <ul className="list-disc list-inside space-y-1 text-black">
              <li>Approved</li>
              <li>Not Approved</li>
              <li>Active</li>
              <li>Not Active</li>
            </ul>

            <p>
              To become an admin, reach out directly to
              <span className="font-semibold text-black"> Lisa</span> who can
              grant you the appropriate permissions.
            </p>

            <p>
              An <span className="font-semibold">Approved Ingredient</span>{" "}
              means a superuser has reviewed the ingredient and accepted it into
              the database.
            </p>

            <p>
              An <span className="font-semibold">Active Ingredient</span> is an
              approved ingredient that is currently usable in formulas. An
              ingredient may be inactive if it has not been approved yet or if
              the product is no longer being sold.
            </p>
          </div>

          {/* Video Placeholder */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-black mb-4">
              Admin Tutorial Video
            </h3>

            <div className="aspect-video w-full rounded-xl border border-secondary overflow-hidden bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/Vuzyvqxmgw4"
                title="Admin Tutorial Video Placeholder"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
        {/* --- Superuser Guide Section --- */}
        <section className="bg-secondary/10 border border-secondary rounded-xl p-6 md:p-10 space-y-8">
          <h2 className="text-2xl font-semibold text-black">Superuser Guide</h2>

          <div className="space-y-6 text-sm md:text-base leading-relaxed text-black">
            <p>
              Superusers have all admin permissions along with additional
              controls that allow approving, activating, and deactivating
              ingredients. These controls appear directly on the
              <span className="font-semibold text-black"> Admin Panel</span>.
            </p>

            <p>
              When you review an ingredient and determine it is correct and
              ready for use, click the
              <span className="font-semibold text-black"> Approve</span> button.
              This confirms the ingredient as valid and accepted into the
              database.
            </p>

            <p>
              If an ingredient is approved and is actively being sold, click
              <span className="font-semibold text-black"> Activate</span>.
              Activated ingredients become available for use inside the Formula
              Calculator.
            </p>

            <p>
              If an ingredient is currently active but is no longer being sold,
              you should
              <span className="font-semibold text-black"> Deactivate</span> it.
              Deactivated ingredients will still remain in the database but can
              no longer be used in new formulas.
            </p>

            <p>
              After clicking Approve, Activate, or Deactivate, a set of
              checkboxes will appear next to each ingredient. Select all
              ingredients that you want to approve, activate, or deactivate at
              the same time. This allows you to bulk update multiple items
              quickly.
            </p>

            <p>
              If you change your mind or decide not to continue with these
              changes, click the
              <span className="font-semibold text-black"> Cancel</span> button
              located in the bottom-right corner. This will close the
              bulk-action mode without applying any updates.
            </p>
          </div>

          {/* Video Placeholder */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-black mb-4">
              Superuser Tutorial Video
            </h3>

            <div className="aspect-video w-full rounded-xl border border-secondary overflow-hidden bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/HL-k6-J4YvE"
                title="Superuser Tutorial Video Placeholder"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
        <section className="bg-secondary/10 border border-secondary rounded-xl p-6 md:p-10 space-y-8">
          <h2 className="text-2xl font-semibold text-black">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6 text-sm md:text-base leading-relaxed text-black">
            <p>
              For additional resources, troubleshooting steps, and extended
              documentation, please visit our FAQ website. This site will
              contain answers to common questions about account management,
              using the calculators, admin permissions, and system behavior.
            </p>

            <p>
              You can access it here:
              <a
                href={website}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-accent underline underline-offset-2 ml-1"
              >
                Visit FAQ Website
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
