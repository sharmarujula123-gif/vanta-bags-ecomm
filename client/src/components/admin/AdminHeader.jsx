const AdminHeader = ({ title, description, children }) => (
  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
    <div>
      <p className="text-xs font-bold tracking-[0.25em] text-stone-500">
        VANTA ADMIN
      </p>
      <h1 className="mt-3 font-serif text-5xl">{title}</h1>
      <p className="mt-3 text-sm text-stone-500">{description}</p>
    </div>

    {children && <div className="flex gap-3">{children}</div>}
  </div>
);

export default AdminHeader;
