import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { Grid } from "@mui/material";
import HispRealtimeDetail from "./HispRealtimeDetail";
import axios from "axios";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

function HispRealtime({
  lpr,
  province,
  status_weight,
  status_color,
  image,
  data_date,
  data_time,
  gross,
  color_weight = "blue",
  max,
  speed,
  axal,
  ex_gross = "",
  id,
  overview,
  swaped,
}) {
  const url = "http://127.0.0.1:3001/api/HSrealtime";
  const [loading, setLoading] = useState(true);
  const [getData, setGetData] = useState([]);

  const navigate = useNavigate();

  const viewMore = (id) => {
    navigate("/hsDetail", { state: { id: id } });
  };

  const fetchData = () => {
    const updateData = async () => {
      try {
        const res = await axios.get(url);

        if (res.status === 200 && res.data) {
          setGetData(res.data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    updateData();
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Section>
        <Loading />
      </Section>
    );
  }

  return (
    <Section>
      <div className="realtime-body">
        <Grid
          container
          spacing={4}
          direction="row"
          justifyContent="space-around"
          style={{ minHeight: "80vh" }}
        >
          {getData.map((res) => {
            let status_show = "";
            if (!res.lpr_number) {
              res.lpr = "-";
            }
            if (!res.province) {
              res.province = "";
            }
            if (res.status_weight === "PASS") {
              status_color = "success";
              status_show = "PASS";
            }
            if (res.status_weight === "OVER") {
              status_color = "error";
              status_show = "Warning";
            }
            if (res.status_weight === "ERROR") {
              status_color = "secondary";
              status_show = "Error";
            }

            const getDate = res.date;
            const splited = getDate.split("/");
            const swaped = splited[1] + "/" + splited[0] + "/" + splited[2];
            data_date = swaped;
            max = parseInt(res.max_weight);
            gross = parseInt(res.gross);
            data_time = res.time.slice(0, 8);
            speed = Math.round(res.speed * 0.1);
            color_weight = "blue";
            ex_gross = "";
            id = res.sequence_no;
            overview = res.img_overview;

            if (gross > max) {
              const exg = ((gross - max) * 100) / gross;

              ex_gross = `+${exg.toString().slice(0, 3)}%`;
              color_weight = "red";
            }

            return (
              <HispRealtimeDetail
                key={id}
                lpr={res.lpr_number}
                province={res.province}
                status_weight={status_show}
                status_color={status_color}
                image={`data:image/png;base64,${overview}`}
                data_date={data_date}
                data_time={data_time}
                max={max}
                gross={gross}
                color_weight={color_weight}
                lane={res.lane}
                speed={speed}
                axle={res.sum_axle}
                ex_gross={ex_gross}
                legal_class={res.legal_class}
                class_detail={res.class_detail}
                viewMore={() => viewMore(res.id)}
              />
            );
          })}
        </Grid>
      </div>
    </Section>
  );
}
export default HispRealtime;

const Section = styled.section`
  .realtime-body {
    margin-left: 2%;
  }
  .spinner-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10%;
  }
`;
