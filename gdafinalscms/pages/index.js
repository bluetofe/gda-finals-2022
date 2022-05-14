import Head from "next/head";
import NextImage from "next/image";
import { PrismicLink, PrismicText } from "@prismicio/react";
import * as prismicH from "@prismicio/helpers";
import {RichText} from 'prismic-reactjs';
import Slider from "react-slick";

import { createClient } from "../prismicio";
import { Layout } from "../components/Layout";


const Index = ({ projects, navigation, settings }) => {
  const settingsSlider = {
    dots: true,
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
            <div className="project">
              <div className="image"><img src={item.data.image.url}/></div>
              <div className="name">{item.data.name}</div>
              <div className="title">{item.data.title}</div>
              <div className="description">
                <RichText render={item.data.description}/>
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

  const projects = await client.getAllByType("project", { });
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
