import { Mail, User } from "lucide-react";

const ContactSection = ({ user }) => {
  return (
    <section className="border-b border-stone-200 pb-8">
      <div className="mb-6">
        <p className="text-xs font-bold tracking-[0.2em] text-stone-500">
          CONTACT
        </p>

        <h2 className="mt-2 font-serif text-2xl">
          Your information
        </h2>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 border border-stone-200 bg-stone-50 px-4 py-4">
          <User
            size={18}
            strokeWidth={1.7}
            className="text-stone-500"
          />

          <div>
            <p className="text-xs text-stone-500">
              Name
            </p>

            <p className="text-sm font-medium">
              {user?.name || "Customer"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border border-stone-200 bg-stone-50 px-4 py-4">
          <Mail
            size={18}
            strokeWidth={1.7}
            className="text-stone-500"
          />

          <div>
            <p className="text-xs text-stone-500">
              Email
            </p>

            <p className="text-sm font-medium">
              {user?.email || ""}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;