import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';
import './App.css';
import NavigationContainer from './navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';

const AppContainer = () => {

  const getLibrary = (provider) => {
    return new Web3(provider)
  }

  return (
    <div className="App">
      <Web3ReactProvider getLibrary={getLibrary}>
        <Header />
        <NavigationContainer />
        <ToastContainer />
      </Web3ReactProvider>
    </div>
  )
}

export default AppContainer;
