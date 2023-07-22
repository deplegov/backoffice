import React from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormSelect,
} from "@coreui/react";
import api from "../../../const/api";
import Loading from "../Loading";

export default class UpdateUser extends React.Component {
  constructor(props) {
    super(props);
    const { match } = props;
    this.state = {
      user_id: match && match.params && match.params.id,
      name: "",
      surname: "",
      username: "",
      number_phone: "",
      gender: "",
      address: "",
      email: "",
      role_id: null,
      role: null,
      user: null,
      ready: false,
      error: "",
      load: false,
    };
  }

  componentDidMount() {
    this.getUser();
    this.getRole();
  }

  getUser() {
    this.setReady(false);
    fetch(api(`users/${this.state.user_id}`), { method: "GET" }).then((res) => {
      if (res.ok)
        res.json().then((data) => {
          if (data) {
            this.setState({
              user: data.user,
              name: data.user.name,
              surname: data.user.surname,
              username: data.user.username,
              gender: data.user.gender,
              address: data.user.address,
              number_phone: data.user.number_phone,
              email: data.user.email,
              role_id: data.user.role_id.id,
              ready: true,
            });
            if (data.user.email === null) {
              this.setState({ email: "" });
            }
          }
        });
    });
  }

  getRole() {
    this.setLoad(true);
    fetch(api(`role`)).then((res) => {
      if (res.ok)
        res.json().then((data) => {
          if (data && data.roles)
            this.setState({
              role: data.roles,
            });
        });
    });
    this.setLoad(false);
  }

  updateUser() {
    this.setLoad(true);
    fetch(api(`users/${this.state.user_id}`), {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      body: JSON.stringify({
        name: this.state.name,
        surname: this.state.surname,
        username: this.state.username,
        gender: this.state.gender,
        address: this.state.address,
        number_phone: this.state.number_phone,
        email: this.state.email,
        role_id: this.state.role_id,
        modification_date: new Date(),
      }),
    }).then((res) => {
      if (res.ok) {
        console.log(res);
        this.setError("Modification réussie");
        this.setLoad(false);
        this.props.history.push("/Home");
      } else
        res.json().then((res) => {
          this.setError(res.message);
          this.setLoad(false);
        });
    });
  }
  render() {
    const {
      name,
      surname,
      username,
      gender,
      user,
      role_id,
      role,
      address,
      number_phone,
      email,
      ready,
      error,
      load,
    } = this.state;
    return (
      <div className="bg-light min-vh-50 d-flex flex-row align-items-center">
        {!ready ? (
          <>
            <Loading></Loading>
          </>
        ) : (
          <CContainer>
            {" "}
            <CRow className="justify-content-center">
              <CCol md={9} lg={9} xl={6}>
                <CCard className="mx-4">
                  <CCardBody className="p-4">
                    <CForm
                      onSubmit={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <h1>Modification utilisateur</h1>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Nom</CInputGroupText>
                        <CFormInput
                          type="text"
                          placeholder={user.name}
                          autoComplete="Nom"
                          value={name}
                          onChange={this.setName}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Prénom</CInputGroupText>
                        <CFormInput
                          type="text"
                          placeholder={user.surname}
                          autoComplete="Prénom"
                          value={surname}
                          onChange={this.setSurname}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText
                          component="label"
                          htmlFor="inputGroupSelect01"
                        >
                          Genre
                        </CInputGroupText>
                        <CFormSelect
                          id="inputGroupSelect01"
                          onChange={this.setGender}
                          value={gender}
                          required
                        >
                          <option value={"M"}>Homme</option>
                          <option value={"F"}>Femme</option>
                        </CFormSelect>
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Adresse</CInputGroupText>
                        <CFormInput
                          type="text"
                          placeholder={user.address}
                          autoComplete="Adresse"
                          value={address}
                          onChange={this.setAddress}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Numéro de téléphone</CInputGroupText>
                        <CFormInput
                          type="number"
                          placeholder={user.number_phone}
                          autoComplete="Numéro de téléphone"
                          value={number_phone}
                          onChange={this.setNumberPhone}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>@</CInputGroupText>
                        <CFormInput
                          type="email"
                          placeholder={user.email}
                          autoComplete="Email"
                          value={email}
                          onChange={this.setEmail}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Username</CInputGroupText>
                        <CFormInput
                          type="text"
                          placeholder={user.username}
                          autoComplete="Username"
                          value={username}
                          onChange={this.setUsername}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText
                          component="label"
                          htmlFor="inputGroupSelect01"
                        >
                          Role
                        </CInputGroupText>
                        <CFormSelect
                          id="inputGroupSelect01"
                          onChange={this.setRoleId}
                          value={role_id}
                          required
                        >
                          <option> </option>
                          {role &&
                            role.map((c, index) => (
                              <option key={index} value={c.id}>
                                {c.entitled}
                              </option>
                            ))}
                        </CFormSelect>
                      </CInputGroup>
                      <div className="d-grid">
                        {load ? (
                          <CButton
                            id="aim-color-green"
                            className="px-4"
                            disabled
                          >
                            <Loading></Loading>
                          </CButton>
                        ) : (
                          <CButton
                            color="success"
                            type="submit"
                            onClick={() => this.updateUser()}
                          >
                            Modifier
                          </CButton>
                        )}
                        <label>{error}</label>
                      </div>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CContainer>
        )}
      </div>
    );
  }
  setName = (e) => {
    this.setState({
      name: e.target.value,
    });
  };
  setSurname = (e) => {
    this.setState({
      surname: e.target.value,
    });
  };
  setGender = (e) => {
    this.setState({
      gender: e.target.value,
    });
  };
  setAddress = (e) => {
    this.setState({
      address: e.target.value,
    });
  };
  setNumberPhone = (e) => {
    this.setState({
      number_phone: e.target.value,
    });
  };
  setEmail = (e) => {
    this.setState({
      email: e.target.value,
    });
  };
  setLoad(l) {
    this.setState({
      load: l,
    });
  }
  setReady(load) {
    this.setState({
      ready: load,
    });
  }

  setError = (err) => {
    this.setState({
      error: err,
    });
  };

  setUsername = (e) => {
    this.setState({
      username: e.target.value,
    });
  };

  setRoleId = (e) => {
    this.setState({
      role_id: e.target.value,
    });
  };
}
