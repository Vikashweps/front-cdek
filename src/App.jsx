import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home';       
import Registration from './pages/registration';
import Registration_end from './pages/registration-end';
import Profile from './pages/profile';
import Profile_red from './pages/profile-red';
import Wishlist from './pages/wishlist';
import Wishlist_add from './pages/wishlist-add';
import Wishlist_red from './pages/wishlist-red';
import Wishlist_Santa from './pages/wishlist-santa';
import Game from './pages/game';
import Game_edit from './pages/game-edit';
import Game_add from './pages/game-add';
import Game_add_link from './pages/game-add-link';
import Letter from './pages/letter';
import SecretChat from './pages/chat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/registration-end" element={<Registration_end />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/wishlist-add" element={<Wishlist_add />} />
        <Route path="/wishlist-red" element={<Wishlist_red />} />
        <Route path="/profile-red" element={<Profile_red />} />
        <Route path="/game" element={<Game />} />
        <Route path="/game-edit" element={<Game_edit />} />
        <Route path="/game-add" element={<Game_add />} />
        <Route path="/game-add-link" element={<Game_add_link />} />
        <Route path="/game-letter" element={<Letter />} />
        <Route path="/wishlist-santa" element={<Wishlist_Santa />} />
        <Route path="/game-chat" element={<SecretChat />} />
      </Routes>
    </Router>
  )
}

export default App