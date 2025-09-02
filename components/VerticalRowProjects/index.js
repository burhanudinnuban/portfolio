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
        title="HokBen"
        description="The HokBen app available for mobile Android and IOS. In this App, I'm as React Native Developer with Springboot"
        description2="The tool i use is React Native/Javascript and Java Springboot"
        description3="PT.Eka Bogainti"
        image="./trac.png"
        imageAlt="tractogo"
        linkAndroid="https://play.google.com/store/apps/details?id=com.trac.tractogo&hl=id"
        linkIOS="https://apps.apple.com/id/app/tractogo-rental-mobil-terbaik/id1459840738?l=id"
        link="https://www.trac.astra.co.id/"
        reverse
      />
      <VerticalFeatureRow
        title="Trac To Go"
        description="The Trac To Go app available for mobile Android and IOS. In this App, I'm as React Native Developer with javascript language"
        description2="The tool i use is React Native/Javascript"
        description3="PT.Serasi Autoraya"
        image="./trac.png"
        imageAlt="tractogo"
        linkAndroid="https://play.google.com/store/apps/details?id=com.trac.tractogo&hl=id"
        linkIOS="https://apps.apple.com/id/app/tractogo-rental-mobil-terbaik/id1459840738?l=id"
        link="https://www.trac.astra.co.id/"
      />
      <VerticalFeatureRow
        title="ProSpark - Transforms Learning"
        description="The ProSpark - Transforms Learning app available for mobile Android and IOS. In this App, I'm as React Native Developer with javascript language"
        description2="The tool i use is React Native/Javascript"
        description3="PT.Prospark"
        image="./prospark.png"
        imageAlt="sipitung"
        linkAndroid="https://play.google.com/store/apps/details?id=com.prospark.demo"
        linkIOS="https://apps.apple.com/id/app/prospark-transforms-learning/id1438625157"
        link="https://www.trac.astra.co.id/"
        reverse
      />
      <VerticalFeatureRow
        title="SiPitung"
        description="The SiPitung app available for mobile Android and IOS. In this App, I'm as React Native Developer with javascript language"
        description2="The tool i use is React Native/Javascript"
        description3="PT.Generasi Informasi Optima"
        image="./sipitung.png"
        imageAlt="sipitung"
        linkAndroid="https://play.google.com/store/apps/details?id=com.genio.sipitung"
        linkIOS="https://apps.apple.com/us/app/sipitung/id1576839531"
        link="https://sipitung.co.id"
      />
      <VerticalFeatureRow
        title="IndiHome Smart"
        description="The IndoHome Smart app available for mobile Android and IOS. I'm as IOS native developer using Swift5 and Xcode"
        description2="The tool i use is Swift5/Xcode"
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
        description="The Genioo app available for mobile Android. In this app, I'm as FullStack Developer."
        description2="The tool i use is React Native/Javascript, CPanel, Cedeigniter, MySQL"
        description3="PT.Generasi Informasi Optima"
        image="./genioo.png"
        imageAlt="Third feature alt text"
        linkAndroid="https://play.google.com/store/apps/details?id=com.genioo"
        linkIOS=""
        link="https://genio.co.id"
      />
      <VerticalFeatureRow
        title="E-Recycle"
        description="The E-Recycle mobile app for Android and IOS official release to the public. In this app, I'm as mobile developer using Android Studio and java language."
        description2="The tool i use is Android Studio"
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
        description2="The tool i use is React JS"
        description3="PT.Generasi Informasi Optima"
        image="./adminsipitung.png"
        imageAlt="adminsipitung"
        link="http://admin.sipitung.co.id"
      />
    </Section>
  );
}
