import React from "react";
import VerticalFeatureRow from "./VerticalFeatureRow";
import Section from "../Section";

export default function VerticalRowProjects() {
  return (
    <Section
      title="Let me help your company to grow up."
      description="So if you were waiting for the perfect time to hire me the time is NOW......"
      title2="Projects"
    >
      <VerticalFeatureRow
        title="SiPitung"
        description="The SiPitung app for Android Official and IOS was release to the public. In this App, I'm a React Native Developer with javascript language"
        description2="React Native, MongoDB, ExpressJS, AWS"
        description3="PT.Generasi Informasi Optima"
        image="./sipitung.png"
        imageAlt="sipitung"
        linkAndroid="https://play.google.com/store/apps/details?id=com.genio.sipitung"
        linkIOS=""
        link="https://sipitung.co.id"
      />
      <VerticalFeatureRow
        title="IndiHome Smart"
        description="The Indihome Smart mobile app for Android and IOS official release to the public. I'm a IOS native developer using Swift5 and Xcode"
        description2="Swift5/Xcode, Android Studio/kotlin, Codeigniter"
        description3="PT.Telkom"
        image="./indihomesmart.png"
        imageAlt="indihomesmart"
        linkAndroid="https://play.google.com/store/apps/details?id=com.telkom.indihome.smart"
        linkIOS="https://play.google.com/store/apps/details?id=com.lestari.user.erecycle"
        link="https://smart.indihome.co.id/smartcam-pro/"
        reverse
      />
      <VerticalFeatureRow
        title="Genioo"
        description="The Genioo mobile app for Android official release to the public and IOS is currently pending to release. In this app, I'm a Android Studio Developer and java language."
        description2="React Native, CPanel, Cedeigniter, MySQL"
        description3="PT.Generasi Informasi Optima"
        image="./genioo.png"
        imageAlt="Third feature alt text"
        linkAndroid="https://play.google.com/store/apps/details?id=com.genioo"
        linkIOS=""
        link="https://genio.co.id"
      />
      <VerticalFeatureRow
        title="E-Recycle"
        description="The E-Recycle mobile app for Android and IOS official release to the public. In this app, I'm a front end developer using Android Studio and java language."
        description2="Android Studio, Swift, Cedeigniter, AZURE, ERP"
        description3="PT.Multi Inti Digital Lestari"
        image="./erecycle.png"
        imageAlt="erecycle"
        linkAndroid="https://play.google.com/store/apps/details?id=com.lestari.user.erecycle"
        linkIOS="https://apps.apple.com/id/app/erecycle-id/id1542960666"
        link="https://erecycle.id"
        reverse
      />
      <VerticalFeatureRow
        title="Admin SiPitung Dashboard"
        description="Admin SiPitung is a website for manage user and monitoring Dashboard. In this web, i'm as React JS Developer"
        description2="React JS, Javascript, Express JS, AWS"
        description3="PT.Generasi Informasi Optima"
        image="./adminsipitung.png"
        imageAlt="adminsipitung"
        link="http://admin.sipitung.co.id"
      />
    </Section>
  );
}
