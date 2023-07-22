import React from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import moment from "moment";
import CIcon from "@coreui/icons-react";
import { cilMediaPlay, cilMediaStop } from "@coreui/icons";
import api from "../../../const/api";

export default class GameTimes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      services: [],
      options: [],
      selectedOptions: [],
      durations: [],
      prices: [],
      gameTimes: {},
      load: false,
    };
  }

  componentDidMount() {
    this.getUser();
    this.getOptionData();
    this.getServiceData(() => {
      this.getGameTimes(() => {
        setInterval(() => {
          const durations = this.state.services.map((service) => {
            return this.getDuration(service.id);
          });
          const prices = this.state.services.map((service, index) => {
            return this.getPrice(index);
          });
          this.setState({ durations, prices });
        }, 1000);
      });
    });
  }

  clearData(index) {
    const service = this.state.services[index];
    // clear gameTime for index
    let gameTimes = this.state.gameTimes;
    gameTimes[service.id] = { price: service.price };
    // clear timer duration and price for index
    let durations = this.state.durations;
    durations[index] = "00:00:00";
    let prices = this.state.prices;
    prices[index] = service.price;
    this.setState({ gameTimes, durations, prices });
    // clear game time for index in session storage
    sessionStorage.setItem("gameTimes", JSON.stringify(gameTimes));
  }

  getUser() {
    if (sessionStorage.getItem("user")) {
      this.setState({
        user: JSON.parse(sessionStorage.getItem("user")),
      });
    }
  }

  getPrice(index) {
    const id = this.state.services[index].id;
    if (
      this.state.gameTimes &&
      this.state.gameTimes[id] &&
      (this.state.gameTimes[id].startTime ||
        this.state.gameTimes[id].stopTime) &&
      this.state.gameTimes[id].stopped
    ) {
      return this.state.prices[index];
    } else {
      let time = this.state.durations[index];
      time = time.split(":");
      time = Number(time[0]) * 60 + Number(time[1]);
      if (time === 0) time = 1;
      return this.state.gameTimes[id].price * time;
    }
  }

  getDuration(id) {
    if (
      this.state.gameTimes &&
      this.state.gameTimes[id] &&
      (this.state.gameTimes[id].startTime || this.state.gameTimes[id].stopTime)
    ) {
      let time = 0;
      if (!this.state.gameTimes[id].stopped) {
        time = Date.now() - this.state.gameTimes[id].startTime;
      } else {
        time =
          this.state.gameTimes[id].stopTime -
          this.state.gameTimes[id].startTime;
      }
      const hour = Math.floor((time / (1000 * 60 * 60)) % 24).toLocaleString(
        "en-US",
        {
          minimumIntegerDigits: 2,
          useGrouping: false,
        }
      );
      const minute = Math.floor((time / 1000 / 60) % 60).toLocaleString(
        "en-US",
        {
          minimumIntegerDigits: 2,
          useGrouping: false,
        }
      );
      const second = Math.floor((time / 1000) % 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
      return `${hour}:${minute}:${second}`;
    }
    return "00:00:00";
  }

  startOrStop(id) {
    if (
      this.state.gameTimes &&
      this.state.gameTimes[id] &&
      this.state.gameTimes[id].stopped === false
    )
      return false;
    return true;
  }

  start(index) {
    let gameTime = {
      option: this.state.selectedOptions[index],
      price: this.state.gameTimes[this.state.services[index].id].price,
      startTime: new Date(),
      stopped: false,
    };
    let gameTimes = this.state.gameTimes;
    if (!gameTimes) gameTimes = {};
    gameTimes[this.state.services[index].id] = gameTime;
    this.setState({ gameTimes });
    sessionStorage.setItem("gameTimes", JSON.stringify(gameTimes));
  }

  stop(index) {
    let gameTimes = this.state.gameTimes;
    gameTimes[this.state.services[index].id].stopped = true;
    gameTimes[this.state.services[index].id].stopTime = new Date();
    this.setState({ gameTimes });
    sessionStorage.setItem("gameTimes", JSON.stringify(gameTimes));
  }

  getGameTime(console) {
    if (
      this.state.gameTimes &&
      this.state.gameTimes[console] &&
      this.state.gameTimes[console].startTime
    )
      return moment(this.state.gameTimes[console].startTime).format("HH:mm:ss");
    else return "";
  }

  getGameTimes(callback) {
    let gameTimes = JSON.parse(sessionStorage.getItem("gameTimes"));
    if (gameTimes) {
      Object.entries(gameTimes).forEach(([id, gameTime]) => {
        if (gameTime.startTime)
          gameTime.startTime = new Date(gameTime.startTime);
        else delete gameTime.startTime;
        if (gameTime.stopTime) gameTime.stopTime = new Date(gameTime.stopTime);
        else delete gameTime.stopTime;
      });
      this.setState(
        {
          gameTimes,
        },
        callback
      );
    } else {
      gameTimes = {};
      this.state.services.forEach((service) => {
        gameTimes[service.id] = { price: service.price };
      });
      this.setState(
        {
          gameTimes,
        },
        callback
      );
    }
  }

  getOptionData = () => {
    this.setLoading(true);
    fetch(api(`services?isOption=1`)).then((res) => {
      if (res.ok) {
        return res.json().then((data) => {
          this.setState({
            options: data.services,
          });
          this.setLoading(false);
        });
      }
    });
  };

  getServiceData = (callback) => {
    this.setLoading(true);
    fetch(api(`services?type=console`)).then((res) => {
      if (res.ok) {
        return res.json().then((data) => {
          this.setState(
            {
              services: data.services,
              selectedOptions: Array(data.services.length).fill(0),
              durations: Array(data.services.length).fill(""),
              prices: data.services.map((service) => service.price),
            },
            callback
          );
          this.setLoading(false);
        });
      }
    });
  };

  onChangePrice(e, index) {
    const price = Number(e.target.value);
    // change price in game times
    let gameTimes = this.state.gameTimes;
    const id = this.state.services[index].id;
    gameTimes[id].price = price;
    // change price in prices state array
    let prices = this.state.prices;
    prices[index] = price;
    // change states
    this.setState({ gameTimes, prices });
  }

  setLoading(state) {
    this.setState({
      loading: state,
    });
  }

  onChangeOption(e, index) {
    const opt = e.target.value;
    // change selected option
    let selectedOptions = this.state.selectedOptions;
    selectedOptions[index] = opt;
    // change price in game times
    let gameTimes = this.state.gameTimes;
    const id = this.state.services[index].id;
    if (opt != 0) {
      gameTimes[id].price =
        this.state.services[index].price +
        this.state.options.filter((option) => option.id == opt)[0].price;
    } else {
      gameTimes[id].price = this.state.services[index].price;
    }
    // change price in prices
    let prices = this.state.prices;
    prices[index] = gameTimes[id].price;
    gameTimes[id].option = opt;
    // change states
    this.setState({ selectedOptions, gameTimes, prices });
  }

  addPurchase(index) {
    let id = this.state.user.id;
    const idOption = parseInt(this.state.selectedOptions[index]);
    let entitledOption = null;
    if (idOption > 0) entitledOption = this.state.options.filter((option) => option.id === idOption)[0].entitled;
    fetch(api("purchase/console"), {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        entitledOption,
        total_amount: this.state.prices[index],
        received_by: id,
        note: "",
        formValues: [
          { quantity: "1", service: String(this.state.services[index].id) },
        ],
        services: this.state.services,
      }),
    }).then((res) => {
      if (res.ok) this.clearData(index);
      else {
        res.json().then((res) => {
          this.setLoading(false);
        });
      }
    });
  }

  render() {
    const { services, options } = this.state;
    return (
      <div className="bg-light min-vh-50 d-flex flex-row align-items-center">
        <CContainer>
          {" "}
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <span className="d-grid gap-2 d-md-flex justify-content-between">
                    <strong>Temps de jeu</strong>
                  </span>
                </CCardHeader>
                <CCardBody>
                  <CTable>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">Console</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Option</CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Heure début
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">Durée</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Prix</CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Play / Stop
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col"></CTableHeaderCell>
                        <CTableHeaderCell scope="col"></CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {services &&
                        services.map((service, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell>{service.entitled}</CTableDataCell>
                            <CTableDataCell>
                              <CFormSelect
                                id="option"
                                onChange={(e) => this.onChangeOption(e, index)}
                                value={
                                  (this.state.gameTimes &&
                                    this.state.gameTimes[service.id] &&
                                    this.state.gameTimes[service.id].option) ||
                                  0
                                }
                                disabled={
                                  this.state.gameTimes &&
                                  this.state.gameTimes[service.id] &&
                                  (this.state.gameTimes[service.id].startTime ||
                                    this.state.gameTimes[service.id]
                                      .stopTime) &&
                                  !this.state.gameTimes[service.id].stopped
                                }
                              >
                                <option value={0}>Aucune option</option>
                                {options &&
                                  options.map((option, index) => (
                                    <option key={index} value={option.id}>
                                      {option.entitled}
                                    </option>
                                  ))}
                              </CFormSelect>
                            </CTableDataCell>
                            <CTableDataCell>
                              {this.getGameTime(service.id)}
                            </CTableDataCell>
                            <CTableDataCell>
                              {this.state.durations[index]}
                            </CTableDataCell>
                            <CTableDataCell>
                              <CInputGroup className="mb-2">
                                <CFormInput
                                  type="number"
                                  name="price"
                                  min={1}
                                  value={
                                    isNaN(this.state.prices[index])
                                      ? ""
                                      : this.state.prices[index]
                                  }
                                  onChange={(e) => this.onChangePrice(e, index)}
                                  disabled={
                                    this.state.gameTimes &&
                                    this.state.gameTimes[service.id] &&
                                    (this.state.gameTimes[service.id]
                                      .startTime ||
                                      this.state.gameTimes[service.id]
                                        .stopTime) &&
                                    !this.state.gameTimes[service.id].stopped
                                  }
                                />
                                <CInputGroupText
                                  component="label"
                                  htmlFor="inputGroupSelect01"
                                >
                                  Ar
                                </CInputGroupText>
                              </CInputGroup>
                            </CTableDataCell>
                            <CTableDataCell>
                              {this.startOrStop(service.id) ? (
                                <CButton onClick={() => this.start(index)}>
                                  <CIcon icon={cilMediaPlay} className="me-2" />
                                  Start
                                </CButton>
                              ) : (
                                <CButton onClick={() => this.stop(index)}>
                                  <CIcon icon={cilMediaStop} className="me-2" />
                                  Stop
                                </CButton>
                              )}
                            </CTableDataCell>
                            <CTableDataCell>
                              {this.state.gameTimes &&
                                this.state.gameTimes[service.id] &&
                                this.state.gameTimes[service.id].stopped && (
                                  <CButton
                                    onClick={() => this.addPurchase(index)}
                                  >
                                    Encaisser
                                  </CButton>
                                )}
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                onClick={() => this.clearData(index)}
                              >
                                Reset
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    );
  }
}
