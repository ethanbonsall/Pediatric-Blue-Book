// File: web/pages/404.tsx
// 404 error page displayed when a user navigates to a non-existent route.
// Provides a user-friendly error message.

const Four04 = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-center align-middle justify-center gap-8 text-text">
      <h1 className="text-3xl font-bold">
        This page is either not set up or doesn&apos;t exist :&#40;
      </h1>
      <h2 className="text-2xl font-semibold">Check back later!</h2>
    </div>
  );
};

export default Four04;
