import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import Profile from '../components/profile/Profile';
import PropTypes from 'prop-types';


//Redux
import { connect } from 'react-redux';

export class profile extends Component {
    render() {
        return (
            <Grid container spacing={10}>
                <Grid item sm={12} xs={12}>
                    <Profile />
                </Grid>
            </Grid>
        )
    }

}

profile.propTypes = {
    data: PropTypes.object.isRequired
};
  
const mapStateToProps = (state) => ({
    data: state.data
});

export default connect(mapStateToProps)(profile);
