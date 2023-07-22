import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CInputGroup,
  CFormInput,
} from "@coreui/react";
import { CChart } from "@coreui/react-chartjs";
import api from "../../../const/api";
import Loading from "../Loading";
export default class GlobalStatistique extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      firstDateDefault: "",
      secondDateDefault: "",
      dataMonthEntry: [],
      dataMonthExpense: [],
      dataMonthBenefit: [],
      labels: [],
      firstDate: "",
      secondDate: "",
      totalMonth: [],
    };
  }
  async componentDidMount() {
    await this.formatDateDefault();
    this.getGlobalStatistique(
      this.state.firstDateDefault,
      this.state.secondDateDefault
    );
  }

  async formatDateDefault() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      startOfMonth.getFullYear(),
      startOfMonth.getMonth() + 2,
      0
    );
    this.setFirstDateDefault(
      startOfMonth.getFullYear() + "-" + (startOfMonth.getMonth() + 1) + "-" + 1
    );
    this.setSeconDateDefault(
      endOfMonth.getFullYear() +
        "-" +
        endOfMonth.getMonth() +
        "-" +
        endOfMonth.getDate()
    );
  }

  getGlobalStatistique = (firstDate, secondDate) => {
    if (firstDate === "") {
      firstDate = this.state.firstDateDefault;
    } else if (secondDate === "") {
      secondDate = this.state.secondDateDefault;
    }
    this.setLoading(true);
    fetch(api(`entry/statistique/${firstDate}/${secondDate}`)).then((res) => {
      if (res.ok) {
        return res.json().then((data) => {
          if (data) {
            this.setState({
              totalMonth: data.totalMonth,
            });

            const labels = [];
            const dataMonthEntry = [];
            const dataMonthExpense = [];
            const dataMonthBenefit = [];
            data.month.entryMonth.forEach((entry, index) => {
              if (
                entry.month === data.month.expenseMonth[index].month &&
                entry.month === data.month.benefitMonth[index].month
              ) {
                dataMonthEntry.push(entry.total_entry);
                dataMonthExpense.push(
                  data.month.expenseMonth[index].total_expense
                  );
                dataMonthBenefit.push(data.month.benefitMonth[index].benefit);
                if (entry.month == 1) {
                  labels.push("Janvier");
                } else if (entry.month == 2) {
                  labels.push("Fevrier");
                } else if (entry.month == 3) {
                  labels.push("Mars");
                } else if (entry.month == 4) {
                  labels.push("Avril");
                } else if (entry.month == 5) {
                  labels.push("Mai");
                } else if (entry.month == 6) {
                  labels.push("Juin");
                } else if (entry.month == 7) {
                  labels.push("Juillet");
                } else if (entry.month == 8) {
                  labels.push("Août");
                } else if (entry.month == 9) {
                  labels.push("Septembre");
                } else if (entry.month == 10) {
                  labels.push("Octobre");
                } else if (entry.month == 11) {
                  labels.push("Novembre");
                } else if (entry.month == 12) {
                  labels.push("Decembre");
                }
              }
            });
            this.setState({
              dataMonthEntry: dataMonthEntry,
              dataMonthExpense: dataMonthExpense,
              dataMonthBenefit: dataMonthBenefit,
              labels: labels,
            });
          }
          this.setLoading(false);
        });
      }
    });
  };

  render() {
    const {
      loading,
      totalMonth,
      firstDate,
      secondDate,
      labels,
      dataMonthEntry,
      dataMonthExpense,
      dataMonthBenefit,
    } = this.state;
    if (loading) {
      return <Loading />;
    }
    return (
      <>
        <div className="bg-light min-vh-50 d-flex flex-row align-items-center">
          <div className="statistique-input">
            <CInputGroup className="mb-3">
              <CFormInput
                type="date"
                placeholder="Debut"
                autoComplete="date"
                value={firstDate}
                onChange={this.setFirstDate}
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CFormInput
                type="date"
                placeholder="Fin"
                autoComplete="date"
                value={secondDate}
                onChange={this.setSeconDate}
              />
            </CInputGroup>
          </div>
        </div>
        <div className="bg-light min-vh-50 d-flex flex-row align-items-center">
          <div className="statistique-card">
            <CCard>
              <CCardHeader style={{ backgroundColor: "#198754" }}>
                Entrée
              </CCardHeader>
              <CCardBody>
                <CCardTitle className="stat-title">
                  {totalMonth.entry > 1000 ? (
                    <>{totalMonth.entry.toLocaleString()} Ar</>
                  ) : (
                    <>{totalMonth.entry} Ar</>
                  )}
                </CCardTitle>
              </CCardBody>
            </CCard>
            <CCard>
              <CCardHeader style={{ backgroundColor: "#dc3545" }}>
                Sortie
              </CCardHeader>
              <CCardBody>
                <CCardTitle className="stat-title">
                  {totalMonth.expense > 1000 ? (
                    <>{totalMonth.expense.toLocaleString()} Ar</>
                  ) : (
                    <>{totalMonth.expense} Ar</>
                  )}
                </CCardTitle>
              </CCardBody>
            </CCard>
            <CCard>
              <CCardHeader style={{ backgroundColor: "#0d6efd" }}>
                Bénéfice
              </CCardHeader>
              <CCardBody>
                <CCardTitle className="stat-title">
                  {totalMonth.benefit > 1000 ? (
                    <>{totalMonth.benefit.toLocaleString()} Ar</>
                  ) : (
                    <>{totalMonth.benefit} Ar</>
                  )}
                </CCardTitle>
              </CCardBody>
            </CCard>
          </div>
        </div>
        <br></br>
        <div>
          <CChart
            type="bar"
            data={{
              labels: labels,
              datasets: [
                {
                  label: "Entrée",
                  backgroundColor: "#198754",
                  borderColor: "#198754",
                  borderWidth: 1,

                  data: dataMonthEntry,
                },
                {
                  label: "Sortie",
                  backgroundColor: "#dc3545",
                  borderColor: "#dc3545",
                  borderWidth: 1,

                  data: dataMonthExpense,
                },
                {
                  label: "Bénéfice",
                  backgroundColor: "#0d6efd",
                  borderColor: "#0d6efd",
                  borderWidth: 1,

                  data: dataMonthBenefit,
                },
              ],
            }}
            labels="months"
          />
        </div>
      </>
    );
  }
  setLoading(state) {
    this.setState({
      loading: state,
    });
  }
  setFirstDateDefault(date) {
    this.setState({
      firstDateDefault: date,
    });
  }
  setSeconDateDefault(date) {
    this.setState({
      secondDateDefault: date,
    });
  }

  setFirstDate = (e) => {
    this.setState({
      firstDate: e.target.value,
    });
    this.getGlobalStatistique(e.target.value, this.state.secondDate);
  };
  setSeconDate = (e) => {
    this.setState({
      secondDate: e.target.value,
    });
    this.getGlobalStatistique(this.state.firstDate, e.target.value);
  };
}
