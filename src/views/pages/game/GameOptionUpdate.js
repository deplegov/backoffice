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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPencil } from "@coreui/icons";
import api from "../../../const/api";
import Loading from "../Loading";

export default class GameOptionUpdate extends React.Component {
  constructor(props) {
    super(props);
    const { match } = props;
    this.state = {
      option_id: match && match.params && match.params.id,
      entitled: "",
      quantity: "",
      price: "",
      option: null,
      ready: false,
      error: "",
      load: false,
    };
  }

  componentDidMount() {
    this.getOption();
  }

  getOption() {
    this.setReady(false);
    fetch(api(`option/${this.state.option_id}`)).then((res) => {
      if (res.ok)
        res.json().then((data) => {
          if (data && data.option)
            this.setState({
              option: data.option,
              ready: true,
              entitled: data.option.entitled,
              price: data.option.pricePerMinute,
              quantity: data.option.quantity,
            });
        });
    });
  }

  updateOption() {
    this.setLoad(true);
    fetch(api(`option/${this.state.option_id}`), {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      body: JSON.stringify({
        entitled: this.state.entitled,
        pricePerMinute: this.state.price,
        quantity: this.state.quantity,
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
    const { entitled, price, quantity, option, ready, error, load } =
      this.state;
    return (
      <div className="bg-light min-vh-50 d-flex flex-row align-items-center">
        {!ready ? (
          <>
            <Loading></Loading>
          </>
        ) : (
          <CContainer>
            <CRow className="justify-content-center">
              <CCol md={9} lg={9} xl={6}>
                <CCard className="mx-4">
                  <CCardBody className="p-4">
                    <CForm
                      onSubmit={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <h1>Modification Option</h1>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilPencil} />
                        </CInputGroupText>
                        <CFormInput
                          type="text"
                          placeholder={option.entitled}
                          autoComplete="Intitule"
                          value={entitled}
                          onChange={this.setEntitled}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Quantité</CInputGroupText>
                        <CFormInput
                          type="number"
                          placeholder={option.quantity}
                          autoComplete="Quantité"
                          value={quantity}
                          onChange={this.setQuantity}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Prix</CInputGroupText>
                        <CFormInput
                          type="number"
                          placeholder={option.pricePerMinute}
                          autoComplete="Prix"
                          value={price}
                          onChange={this.setPrice}
                        />
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
                            onClick={() => this.updateOption()}
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
  setLoad(l) {
    this.setState({
      load: l,
    });
  }
  setEntitled = (e) => {
    this.setState({
      entitled: e.target.value,
    });
  };
  setPrice = (e) => {
    this.setState({
      price: e.target.value,
    });
  };
  setQuantity = (e) => {
    this.state({
      quantity: e.target.value,
    });
  };
  setReady = (load) => {
    this.setState({
      ready: load,
    });
  };

  setError = (err) => {
    this.setState({
      error: err,
    });
  };
}
