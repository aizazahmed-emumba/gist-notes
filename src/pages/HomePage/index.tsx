import { ArrowRightOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import GistGridLayout from "../../Components/GistGridLayout/GistGridLayout";
import GistListLayout from "../../Components/GistListLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchGists } from "../../Slices/actions";
import { RootState } from "../../store";
import { useSearchParams } from "react-router-dom";
import "./Homepage.scss";
import GridLayoutIcon from "../../Components/Icons/GridLayoutIcon";
import ListLayoutIcon from "../../Components/Icons/ListLayoutIcon";
import Skeleton from "../../Components/Skeleton";

const HomePage: React.FC = () => {
  const [gridLayout, setGridLayout] = React.useState<boolean>(true);
  const dispatch = useDispatch();
  const loadingGist = useSelector((state: RootState) => state.gists.loading);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")!) || 1;

  useEffect(() => {
    dispatch(fetchGists(page) as any);
    return () => {};
  }, [page]);

  const handlePageChange = (next: boolean) => {
    if (next) {
      setSearchParams({
        page: (page + 1).toString(),
      });
    } else {
      setSearchParams({
        page: (page - 1).toString(),
      });
    }
  };

  return (
    <div className="py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-normal">Public Gists</h1>
        <div className="flex justify-between items-center w-14">
          <div
            className="cursor-pointer"
            onClick={() => setGridLayout(true)}
            style={{
              backgroundColor: gridLayout ? "#E3E3E3" : "white",
              color: "#B7B7B7",
              borderRadius: "4px  0px 0px 4px",
              border: "1px solid",
              borderColor: "#E3E3E3",
              borderRight: "none",
              padding: "8px 12px 8px 12px",
            }}
          >
            <GridLayoutIcon />
          </div>
          <div
            style={{
              backgroundColor: !gridLayout ? "#E3E3E3" : "white",
              color: "#B7B7B7",
              borderRadius: "0px  4px 4px 0px",
              border: "1px solid",
              borderColor: "#E3E3E3",
              borderLeft: "none",
              padding: "8px 12px 8px 12px",
            }}
            className="cursor-pointer"
            onClick={() => setGridLayout(false)}
          >
            <ListLayoutIcon />
          </div>
        </div>
      </div>

      {loadingGist ? (
        <Skeleton />
      ) : gridLayout ? (
        <GistGridLayout />
      ) : (
        <GistListLayout />
      )}

      <div className="mt-10 flex justify-between items-center w-full">
        <div></div>
        <button
          onClick={() => {
            handlePageChange(true);
          }}
          className="button"
        >
          Next page <ArrowRightOutlined />
        </button>
        <div className="">
          page
          <span className="current-page">{page}</span>
          of 10
          <button
            disabled={page === 1}
            onClick={() => {
              handlePageChange(false);
            }}
            className="button-small"
          >
            {"<"}
          </button>
          <button
            onClick={() => {
              handlePageChange(true);
            }}
            className="button-small"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
