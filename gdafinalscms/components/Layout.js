import { Footer } from "./Footer";

export const Layout = ({
  navigation,
  settings,
  withProfile,
  withSignUpForm,
  children,
}) => {
  return (
    <div className="text-slate-700">
      <main>{children}</main>
      <Footer withSignUpForm={withSignUpForm} settings={settings} />
    </div>
  );
};
