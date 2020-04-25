import App, { Container } from 'next/app';
import Page from '../components/Page';
import { ApolloProvider} from 'react-apollo';
import withData from '../lib/withData';

class MyApp extends App {
  // nextJs Lifecycle method that runs first and allows us to use ebfore first render, exposes via props
  static async getInitialProps({Component, ctx}) {
    let pageProps = {};
    if(Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    // expoes the query to the user
    pageProps.query = ctx.query;
    return { pageProps};
  }

  render() {
    const { Component, apollo, pageProps } = this.props;

    return (
      <Container>
        <ApolloProvider client={apollo}>
          <Page>
            <Component {...pageProps}/>
          </Page>
        </ApolloProvider>
      </Container>
    )

  }
}

export default withData(MyApp);