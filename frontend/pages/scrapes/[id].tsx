import Container from "@/components/container";
import DetailView from "@/components/detail";
import Layout from "@/components/layout";
import Head from "next/head";

function Home() {
  return (
    <Layout>
      <Head>
        <title>Nate - Challenge / Detail</title>
      </Head>
      <Container>
        <DetailView />
      </Container>
    </Layout>
  );
}

export default Home;
