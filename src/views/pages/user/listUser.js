import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CButton,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPlus, cilPencil, cilTrash, cilLockLocked } from "@coreui/icons";
import api from "../../../const/api";
import moment from "moment";
import Loading from "../Loading";

export default class ListUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formModalState: false,
      deleteModalState: false,
      loading: true,
      users: null,
      pagination: [],
      totalPage: 0,
      pageList: 1,
      pageNumber: 10,
      error: "",
      id: 0,
    };
  }

  componentDidMount() {
    // this.getUserData(1);
    const userTemp = [
      {
        id: 1,
        name: "User",
        surname: "Default",
        gender: "M",
        address: "Tana",
        number_phone: "033313516",
        email: "defaul@gmail.com",
        activated: 1,
      },
      {
        id: 2,
        name: "User2",
        surname: "Default2",
        gender: "M",
        address: "Tana",
        number_phone: "03336556",
        email: "defaul2@gmail.com",
        activated: 0,
      },
    ];
    this.setState({ users: userTemp });
  }

  pagination = (totalPages) => {
    let page = [];
    for (let i = 1; i <= totalPages; i++) {
      page.push(i);
    }
    this.setState({ pagination: page });
  };

  getUserData = (page, pageNumber) => {
    this.setLoading(true);
    fetch(api(`users/page/${page}`), { method: "GET" }).then((res) => {
      if (res.ok) {
        return res.json().then((data) => {
          this.setState({
            users: data.users,
            pageList: page,
            pageNumber: pageNumber,
            totalPage: data.pagination.totalPages,
          });
          this.pagination(data.pagination.totalPages);
          this.setLoading(false);
        });
      }
    });
  };

  activatedUser(activation) {
    fetch(api(`users/${this.state.users[this.state.id].id}`), {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        const tmp = [...this.state.users];
        tmp.splice(this.state.id, 1);
        this.setState({
          users: tmp,
        });
        this.setDeleteModalState(false);
      }
    });
  }

  userActivation(index) {
    this.setId(index);
    this.setDeleteModalState(true);
  }

  cancelFormModal = () => {
    this.setFormModalState(false);
    this.clearFields();
    this.setError();
  };

  addUser() {
    this.props.history.push("/register");
  }
  accessAuthorization(id) {
    this.props.history.push("/user/accessAuthorization/" + id);
  }
  userUpdatePassword(id) {
    this.props.history.push("/user/update/password/" + id);
  }

  render() {
    const {
      users,
      loading,
      pageList,
      pageNumber,
      pagination,
      totalPage,
      deleteModalState,
      id,
    } = this.state;
    // if (loading) {
    //   return <Loading />;
    // }
    return (
      <>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Name </CTableHeaderCell>
                      <CTableHeaderCell scope="col">Prénom</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Genre</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Adresse</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Numero</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Date de création
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {users &&
                      users.map((user, index) => (
                        <CTableRow key={user.id}>
                          <CTableDataCell>{user.name}</CTableDataCell>
                          <CTableDataCell>{user.surname}</CTableDataCell>
                          <CTableDataCell>{user.gender}</CTableDataCell>
                          <CTableDataCell>{user.address}</CTableDataCell>
                          <CTableDataCell>{user.number_phone}</CTableDataCell>
                          <CTableDataCell>{user.email}</CTableDataCell>
                          {user.activated === 0 ? (
                            <CTableDataCell style={{ color: "red" }}>
                              Désactiver
                            </CTableDataCell>
                          ) : (
                            <CTableDataCell style={{ color: "green" }}>
                              Activer
                            </CTableDataCell>
                          )}

                          <CTableDataCell>
                            {moment(user.created_date).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color={"light"}
                              onClick={() => this.accessAuthorization(user.id)}
                            >
                              Autorisations d'accès <CIcon icon={cilPencil} />
                            </CButton>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color={"danger"}
                              onClick={() => this.userActivation(index)}
                            >
                              Activation <CIcon icon={cilLockLocked} />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                  </CTableBody>
                </CTable>
                <CPagination aria-label="Page navigation example">
                  <CPaginationItem
                    aria-label="Previous"
                    disabled={pageList === 1}
                    onClick={() => this.getUserData(pageList - 1, pageNumber)}
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </CPaginationItem>
                  {pagination.map((page, index) => (
                    <CPaginationItem
                      key={index}
                      active={page === pageList}
                      onClick={() => this.getUserData(page, pageNumber)}
                    >
                      {` ${page} `}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    aria-label="Next"
                    disabled={
                      totalPage - pageList === 0 ||
                      (users && users.length === 0)
                    }
                    onClick={() => this.getUserData(pageList + 1, pageNumber)}
                  >
                    <span aria-hidden="true"> &raquo; </span>
                  </CPaginationItem>
                </CPagination>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CModal
          alignment="center"
          visible={deleteModalState}
          onClose={() => this.setDeleteModalState(false)}
        >
          <CModalHeader>
            <CModalTitle>Activer ou Désactiver</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p>
              Voulez-vous activer ou désactiver{" "}
              {users && users.length > 0 && id < users.length && users[id].name}
              ?
            </p>
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => this.setDeleteModalState(false)}
            >
              Annuler
            </CButton>
            <CButton color="danger" onClick={() => this.activatedUser(0)}>
              Désactiver
            </CButton>
            <CButton color="success" onClick={() => this.activatedUser(1)}>
              Activer
            </CButton>
          </CModalFooter>
        </CModal>
      </>
    );
  }

  setLoading(state) {
    this.setState({
      loading: state,
    });
  }
  setId(id) {
    this.setState({
      id: id,
    });
  }
  setDeleteModalState(modal) {
    this.setState({
      deleteModalState: modal,
    });
  }
}
