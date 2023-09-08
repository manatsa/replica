import React,{Suspense} from 'react';
import Dashboard from "./screens/dashboard.jsx";
import Users from "./screens/admin/users";
import {Routes, Route, Navigate} from "react-router-dom";
import Settings from "./screens/admin/Settings";
import Industry from "./screens/product/industry.jsx";
import Category from "./screens/product/category.jsx";
import Roles from "./screens/admin/roles";
import Privileges from "./screens/admin/privileges";
import Subscription from "./screens/subscription/Subscription.jsx";
import AuditTrail from "./screens/audit/audit.trail.jsx";
import PaynowReactWrapper from 'paynow-react';

function App() {

    const paynow_config = {
        integration_id: '16459',
        integration_key: 'c2a23ef7-99a3-4782-9b9a-b0f573c04478',
        result_url: '',
        return_url: '',
    };

  return (
    <>

        <PaynowReactWrapper {...paynow_config}>
                <Routes>
                    <Route path="/home" element={<Navigate to={'/'} />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/roles" element={<Roles />} />
                    <Route path="/privileges" element={<Privileges />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/industry" element={<Industry />} />
                    <Route path="/category" element={<Category />} />
                    <Route path="/subscriptions" element={<Subscription />} />
                    <Route path="/audit-trail" element={<AuditTrail />} />
                    <Route path="/" element={<Dashboard />} />
                </Routes>
        </PaynowReactWrapper>

    </>
  );
}

export default App;
