import './App.css';
import React, { useState } from 'react';
import Landing from './pages/landing.jsx';
import Text from './pages/Text.jsx';
import { Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Image from './pages/Image';
import Answer from './pages/Answer';
import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ymifflojmeqlfytlxbhh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltaWZmbG9qbWVxbGZ5dGx4YmhoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3NjA0NDYwNywiZXhwIjoxOTkxNjIwNjA3fQ.lKQ4PxLmrhb4zJeS54IlrTunJWP8f4kyb4DOGNTuhvY'
const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
  return (
    <div className="App">
      <div className="flex flex-col parent min-h-screen min-w-screen">
        <Router>
          <Route exact path="/" component={Landing} />
          <Route exact path="/text" component={Text} />
          <Route exact path="/image" component={Image} />
          <Route exact path="/answer" component={Answer} />
        </Router>
      </div>
    </div>
  );
}

export default App;