import { Footer } from "./Footer";
import {RichText} from 'prismic-reactjs';

export const Layout = ({
  navigation,
  settings,
  children,
}) => {
  console.log(navigation)
  return (
    <div>
      <div className="menu">
        <div className="menu-item logo">
          <a href={'/'}>
            <img src="/finallogo.svg"/>
            {/* From <span>&#40;</span>A<span>&#41;</span> to <span>&#40;</span>X<span>&#41;</span> */}
          </a>
        </div>
        {navigation.data.links.map((item, i) => {
          return(
            <div className="menu-item" key={'menu'+i}>
              <a href={item.link.url ? item.link.url : '#index'}>
                <RichText render={item.label}/>
              </a>
            </div>
          )
        })}
      </div>
      <main>{children}</main>
      <Footer settings={settings} />
    </div>
  );
};
