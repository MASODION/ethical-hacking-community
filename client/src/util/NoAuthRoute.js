import React from 'react'
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const NoAuthRoute = ({ component: Component, authentificated, ...rest }) => (
    <Route
        {...rest}
        render={(props) => 
            authentificated === false ? <Redirect to="/login" /> : <Component {...props} />
        }
    />
);

const mapStateToProps = (state) => ({
    authentificated: state.user.authentificated
});

NoAuthRoute.propTypes = {
    user: PropTypes.object
}

export default connect(mapStateToProps)(NoAuthRoute);