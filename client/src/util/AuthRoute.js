import React from 'react'
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const AuthRoute = ({ component: Component, authentificated, ...rest }) => (
    <Route
        {...rest}
        render={(props) => 
            authentificated === true ? <Redirect to="/" /> : <Component {...props} />
        }
    />
);

const mapStateToProps = (state) => ({
    authentificated: state.user.authentificated
});

AuthRoute.propTypes = {
    user: PropTypes.object
}

export default connect(mapStateToProps)(AuthRoute);