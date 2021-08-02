import Container from "@/components/container";
import HistoryView from "@/components/history";
import Layout from "@/components/layout";
import Head from "next/head";

function History() {
  return (
    <Layout>
      <Head>
        <title>Nate - Challenge / History</title>
      </Head>
      <Container>
        <HistoryView />
      </Container>
    </Layout>
  );
}

export default History;
