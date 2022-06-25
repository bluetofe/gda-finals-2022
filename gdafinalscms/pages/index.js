import React, {useRef,useEffect, useState} from "react";
import {RichText} from 'prismic-reactjs';
import Slider from "react-slick";

import { createClient } from "../prismicio";
import { Layout } from "../components/Layout";


const Index = ({ projects, navigation, settings, index }) => {
  console.log(projects)
  const [elements, setElements] = useState(0);
  const inputEl = useRef(null);
  const slider = useRef('');


  const orderEl = useRef(null);
  const [order, setOrder] = useState(0);
  const [hero, setHero] = useState(0);

  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    setElements(inputEl.current.children);
    setOrder(orderEl.current.children[0].children[3].children)
    setHero(orderEl.current)
    window.addEventListener("scroll", handleScroll);
  });

  useEffect(() => {
    var rand = Math.floor( Math.random() * 28 )
    slider.current.slickGoTo(rand);
    window.setInterval(function(){
      var rand = Math.floor( Math.random() * 28 )
      slider.current.slickGoTo(rand);
    }, 30000);
  }, [])


  const settingsSlider = {
    customPaging: function(i) {
      var arr = [].slice.call(elements);
      var con_el = arr.find(x => x.id === projects[i].data.order);
 
      var xPos = con_el?.getBoundingClientRect().left
      var yPos = con_el?.getBoundingClientRect().top + scrollPosition - hero.offsetHeight - 50

      var offSet = order[i]?.getBoundingClientRect()
    
      return (
        <div className="order" key={'order' + i}>
          {projects[i].data.order.split("").map((item, index) => {
            return(
              <div key={'span'+ index}>{item}</div>
            )
          })}
          <svg className="connect" style={{left: '-' + offSet?.left + 'px',height: yPos +'px', width:  offSet?.left +  xPos  + 'px'}}><line x1={offSet?.left + 15} y1="50" x2={xPos+40} y2={yPos+25}/></svg>
        </div>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    centerMode: true,
    // centerPadding: '300px',
    // autoplay: true,
    // autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          centerPadding: '24px',
          variableHeight: true,
        }
      },
    ]
  };

  return (
    <Layout
      navigation={navigation}
      settings={settings}
    >
      <div className="scroll"> </div>
        <div className="hero"  ref={orderEl}>
          <Slider {...settingsSlider} ref={slider}>
            {projects.map((item, i) => {
              return(
                <div className="project" key={'project'+i}>
                  <a className="mobile-order" href={'#'+ item.data.order}>
                    {/* {item.data.order} */}
                    {item.data.order?.split("").map((elem, index) => {
                      return(
                        <div key={'span'+ index}>{elem}</div>
                      )
                    })}
                  </a>
                  <div className="image"><img src={item.data.image.url}/></div>
                  <div className="info">
                    <div className="name">{item.data.name}</div>
                    <div className="line"></div>
                    <div className="title">{item.data.title}</div>
                    <div className="description">
                      <RichText render={item.data.description}/>
                    </div>
                  </div>
                </div>
              )
            })}
          </Slider>
        </div>

        <div id="index" className="index">
          <div className="title"><RichText render={index.data.title}/></div>
          <div className="list" ref={inputEl}>
            {index.data.slices[0].items.map((item, i) => {
              console.log(item.website.includes('http://'))
              return(
                <div className="index-item" id={item.order} key={'index-item' + i}>
                    <div className="order">
                      {item.order?.split("").map((elem, index) => {
                        return(
                          <div key={'span'+ index}>{elem}</div>
                        )
                      })}
                    </div>
                    <div className="info">
                      <div>{item.name}</div>
                      <div><a href={`mailto:${item.email}`}>Send email</a></div>
                      {item.website.includes('http://') ? 
                        <div><a target="_blank" rel="noreferrer" href={`${item.website}`}>{item.website?.replace('www.instagram.com/', '@').replace('www.','').replace('http://','')}</a></div>
                      :
                        <div><a target="_blank" rel="noreferrer" href={`https://${item.website}`}>{item.website?.replace('www.instagram.com/', '@').replace('www.','').replace('http://`','')}</a></div>
                      }
                    </div>
                </div>
              )
            })}
            <div className="index-item"></div>
            <div className="index-item"></div>
          </div>
        </div>
        <div className="spacer"></div>
    </Layout>
  );
};

export default Index;

export async function getStaticProps({ previewData }) {
  const client = createClient({ previewData });

  const projects = await client.getAllByType("project", { 
    orderings: {
      field: 'my.project.order',
      direction: 'asc',
    },
  });
  const index = await client.getByUID('page', 'index');
  const navigation = await client.getSingle("navigation");
  const settings = await client.getSingle("settings");

  return {
    props: {
      projects,
      index,
      navigation,
      settings,
    },
  };
}
