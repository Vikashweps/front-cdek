import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home';       
import Registration from './pages/registration';
import Profile from './pages/profile';
import Wishlist from './pages/wishlist';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </Router>
  )
}

export default App