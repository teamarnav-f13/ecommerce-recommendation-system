import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import ProductPage from './pages/ProductPage';
import Cart from './pages/Cart';

function App() {
  // Configure sign-up fields
  const formFields = {
    signUp: {
      email: {
        order: 1,
        placeholder: 'Enter your email',
        label: 'Email',
        required: true
      },
      name: {
        order: 2,
        placeholder: 'Enter your full name',
        label: 'Full Name',
        required: true
      },
      password: {
        order: 3,
        placeholder: 'Enter your password',
        label: 'Password',
        required: true
      },
      confirm_password: {
        order: 4,
        placeholder: 'Confirm your password',
        label: 'Confirm Password',
        required: true
      }
    }
  };

  return (
    <Authenticator formFields={formFields} signUpAttributes={['email', 'name']}>
      {({ signOut, user }) => (
        <Router>
          <div className="app">
            <Header user={user} signOut={signOut} />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/product/:productId" element={<ProductPage />} />
                <Route path="/cart" element={<Cart />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      )}
    </Authenticator>
  );
}

export default App;