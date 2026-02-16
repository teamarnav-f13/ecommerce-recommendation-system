import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Authenticator, View, Heading, Text, useTheme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { ShoppingCart } from 'lucide-react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import ProductPage from './pages/ProductPage';
import Cart from './pages/Cart';

function App() {
  const formFields = {
    signUp: {
      email: {
        order: 1,
        placeholder: 'Enter your email',
        label: 'Email Address',
        inputProps: { required: true, type: 'email' }
      },
      name: {
        order: 2,
        placeholder: 'Enter your full name',
        label: 'Full Name',
        inputProps: { required: true }
      },
      password: {
        order: 3,
        placeholder: 'Create a password',
        label: 'Password',
        inputProps: { required: true, type: 'password' }
      },
      confirm_password: {
        order: 4,
        placeholder: 'Confirm your password',
        label: 'Confirm Password',
        inputProps: { required: true, type: 'password' }
      }
    }
  };

  // Custom components for Authenticator
  const components = {
    Header() {
      const { tokens } = useTheme();
      
      return (
        <View textAlign="center" padding={tokens.space.large}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '12px',
            marginBottom: '16px'
          }}>
            <ShoppingCart size={40} color="#2563eb" strokeWidth={2} />
          </div>
          <Heading level={3} style={{ margin: '8px 0', color: '#1e293b', fontSize: '28px', fontWeight: '700' }}>
            Welcome to ShopSmart
          </Heading>
          <Text style={{ color: '#64748b', fontSize: '16px' }}>
            AI-powered product discovery platform
          </Text>
        </View>
      );
    },
    Footer() {
      const { tokens } = useTheme();
      
      return (
        <View textAlign="center" padding={tokens.space.medium}>
          <Text fontSize="0.875rem" color={tokens.colors.font.tertiary}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      );
    }
  };

  return (
    <Authenticator 
      formFields={formFields}
      components={components}
      signUpAttributes={['email', 'name']}
      loginMechanisms={['email']}
    >
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
