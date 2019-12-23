import App, { Container } from 'next/app';
import Page from '../components/Page';
import { ApolloProvider } from 'react-apollo';
import withData from '../lib/withData'

class MyApp extends App {
  //getInitialProps is a special next.js method that runs before the first render and fetch all the queries and mutations from each page
  static async getInitialProps({ Component, ctx}) {
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    //exposing the query to the user:
    pageProps.query = ctx.query
    return { pageProps }
  }
  render() {
    const { Component, apollo, pageProps } = this.props

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