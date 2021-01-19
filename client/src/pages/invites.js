import React, { Component } from 'react'
import PropTypes from 'prop-types';


//redux
import { connect } from 'react-redux';
import { getAllInvites, addNewInvite } from '../redux/actions/userActions';


//mui stuff
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const styles = {
    root: {
        width: '100%'
    }
}

export class invites extends Component {
    state = {
        page: 0,
        rowsPerPage: 10
    }
    componentDidMount() {
        this.props.getAllInvites();
    }
      handleChangePage = (event, newPage) => {
        this.setState({
            page: newPage
        })
      };
      handleChangeRowsPerPage = (event) => {
        this.setState({
            rowsPerPage: event.target.value,
            page: 0
        })
      };
    render() {
        const columns = [
            { id: 'inviteId', label: 'Invitation ID', minWidth: 170 },
            { id: 'type', label: 'Type', minWidth: 100 },
            { id: 'createdAt', label: 'CreatedAt', minWidth: 170 },
            { id: 'receipt', label: 'Receipt', minWidth: 170 },
          ];
        const { classes } = this.props;
        const {
            loading,
            invites
        } = this.props.user;
        return (
            <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && invites && invites.length >= 0 ? (invites.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((invite) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={invite.inviteId}>
                  {columns.map((column) => {
                    const value = invite[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'type' ? (value === 1 ? 'normal user' : 'company') : (column.id === 'createdAt' ? (
                            value.substring(0,10) + ' ' + value.substring(11,19)
                        ) : value)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })) : null}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={!loading && invites && invites.length >= 0 ? invites.length : 0}
        rowsPerPage={this.state.rowsPerPage}
        page={this.state.page}
        onChangePage={this.handleChangePage}
        onChangeRowsPerPage={this.handleChangeRowsPerPage}
      />
    </Paper>
        )
    }
}

invites.propTypes = {
    getAllInvites: PropTypes.func.isRequired,
    addNewInvite: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
}

const mapActionsToProps = {
    getAllInvites,
    addNewInvite
}

const mapStateToProps = (state) => ({
    user: state.user
})

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(invites))
