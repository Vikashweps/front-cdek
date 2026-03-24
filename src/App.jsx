import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home';       
import Registration from './pages/registration';
import Profile from './pages/profile';
import Wishlist from './pages/wishlist';
import Wishlist_add from './pages/wishlist-add';
import Wishlist_red from './pages/wishlist_red';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/wishlist-add" element={<Wishlist_add />} />
        <Route path="/wishlist_red" element={<Wishlist_red />} />
      </Routes>
    </Router>
  )
}

export default App