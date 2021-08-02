import Container from "@/components/container";
import HomeView from "@/components/home";
import Layout from "@/components/layout";
import Head from "next/head";

function Home() {
  return (
    <Layout>
      <Head>
        <title>Nate - Challenge</title>
      </Head>
      <Container>
        <HomeView />
      </Container>
    </Layout>
  );
}

export default Home;
