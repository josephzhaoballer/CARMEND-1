import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';
import { UserList, UserItem } from '../Users';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

const AdminPage = () => (
  <section class = "main-section">
  <div>
    <h1>Admin</h1>
    <p>The Admin Page is accessible by every signed in admin user.</p>

    <Switch>
      <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem} />
      <Route exact path={ROUTES.ADMIN} component={UserList} />
    </Switch>
  </div>
  </section>
);

const condition = authUser =>
  authUser && !!authUser.role[ROLES.ADMIN];

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(AdminPage);
