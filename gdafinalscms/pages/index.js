import Head from "next/head";
import NextImage from "next/image";
import { PrismicLink, PrismicText } from "@prismicio/react";
import * as prismicH from "@prismicio/helpers";
import {RichText} from 'prismic-reactjs';
import Slider from "react-slick";

import { createClient } from "../prismicio";
import { Layout } from "../components/Layout";


const Index = ({ projects, navigation, settings }) => {
  console.log(projects)
  const settingsSlider = {
    customPaging: function(i) {
      return (
        <a className="order" key={'order' + i}>
          {projects[i].data.order.split("").map((item, i) => {
            return(
              <div key={'span'+ i}>{item}</div>
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
  const navigation = await client.getSingle("navigation");
  const settings = await client.getSingle("settings");

  return {
    props: {
      projects,
      navigation,
      settings,
    },
  };
}
