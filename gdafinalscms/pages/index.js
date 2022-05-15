import React, {useRef,useEffect, useState} from "react";
import NextImage from "next/image";
import { PrismicLink, PrismicText } from "@prismicio/react";
import * as prismicH from "@prismicio/helpers";
import {RichText} from 'prismic-reactjs';
import Slider from "react-slick";

import { createClient } from "../prismicio";
import { Layout } from "../components/Layout";


const Index = ({ projects, navigation, settings, index }) => {
  console.log(index)
  const [xPos, setXPos] = useState(50);
  const [yPos, setYPos] = useState(50);
  const [elements, setElements] = useState(0);
  const [order, setOrder] = useState(0);
  const inputEl = useRef(null);
  const orderEl = useRef(null);

  useEffect(() => {
    setElements(inputEl.current.children);
    setOrder(orderEl)
  });

  const settingsSlider = {
    customPaging: function(i) {
      var arr = [].slice.call(elements);
      var con_el = arr.find(x => x.id === projects[i].data.order);
      console.log(order)
      var xPos = con_el?.getBoundingClientRect().left
      var yPos = con_el?.getBoundingClientRect().top

     
      // console.log(con_el.offsetTop)
      return (
        <a className="order" key={'order' + i}>
          {projects[i].data.order.split("").map((item, i) => {
            return(
              <>
              <div key={'span'+ i} ref={orderEl}>{item}</div>
              <svg className="connect"><line x1="0" y1="0" x2={xPos} y2={yPos}/></svg>
              </>
            )
          })}
        </a>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '300px',
  };

  return (
    <Layout
      navigation={navigation}
      settings={settings}
    >
      <div className="hero">
        <Slider {...settingsSlider}>
          {projects.map((item, i) => {
            return(
              <div className="project" key={'project'+i}>
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
            return(
              <div className="index-item" id={item.order} key={'index-item' + i}>
                  <div className="order">{item.order}</div>
                  <div className="info">
                    <div>{item.name}</div>
                    <div>{item.email}</div>
                    <div>{item.website}</div>
                  </div>
              </div>
            )
          })}
        </div>
      </div>
      
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
