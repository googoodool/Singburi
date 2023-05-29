import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";

import { cardStyles } from "./CardReuse";
import { BsFillCalendar2WeekFill } from "react-icons/bs";
import { IoStatsChart } from "react-icons/io5";
import { BiGroup } from "react-icons/bi";
import { FiActivity } from "react-icons/fi";
import Loading from "./Loading";

function HispCardTotal() {
  const url = "http://127.0.0.1:3001/api/Hsoverallcount";
  const [getData, setGetData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    const updateData = async () => {
      try {
        const res = await axios.get(url);
        // console.log(res);
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
    }, 50000);
    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   console.log(getData);
  // }, [getData]);

  return (
    <Section>
      <div className="analytic ">
        <div className="content">
          <h4>จำนวนรถทั้งหมด</h4>
          <h2>{loading ? <Loading /> : getData.TOTAL_Count}</h2>
        </div>
        <div className="logo">
          <BsFillCalendar2WeekFill />
        </div>
      </div>
      <div className="analytic">
        <div className="content">
          <h4>น้ำหนักผ่านกฎหมาย</h4>
          <h2>{loading ? <Loading /> : getData.PASS_Count}</h2>
        </div>
        <div className="logo">
          <IoStatsChart />
        </div>
      </div>
      <div className="analytic">
        <div className="content">
          <h4>คร่อมช่องจราจร</h4>
          <h2>{loading ? <Loading /> : getData.ERROR_Count}</h2>
        </div>
        <div className="logo">
          <BiGroup />
        </div>
      </div>
      <div className="analytic ">
        <div className="content">
          <h4>น้ำหนักเกินกฎหมาย</h4>
          <h2>{loading ? <Loading /> : getData.OVER_Count}</h2>
        </div>
        <div className="logo">
          <FiActivity />
        </div>
      </div>
    </Section>
  );
}
export default HispCardTotal;

const Section = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 3%;

  .analytic {
    ${cardStyles};
    padding: 1rem;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    gap: 1rem;
    transition: 0.5s ease-in-out;
    &:hover {
      background-color: var(--mainColorLight);
      color: var(--textColor);

      .logo {
        background-color: var(--textColor);
        svg {
          color: var(--mainColorLight);
        }
      }
    }
    .logo {
      background-color: var(--mainColorLight);
      border-radius: 3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1.4rem;
      svg {
        font-size: 1.5rem;
        color: var(--textColor);
      }
    }
    .content {
      font-family: "Prompt", sans-serif;
    }
  }

  @media screen and (min-width: 280px) and (max-width: 720px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 3fr));
    .analytic {
      &:nth-of-type(4),
      &:nth-of-type(3) {
        flex-direction: row;
      }
    }
  }
`;
