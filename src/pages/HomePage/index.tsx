import { ArrowRightOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import GistGridLayout from "../../components/GistGridLayout/GistGridLayout";
import GistListLayout from "../../components/GistListLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchGists } from "../../slices/actions";
import { RootState } from "../../store";
import { useSearchParams } from "react-router-dom";
import "./Homepage.scss";
import GridLayoutIcon from "../../components/Icons/GridLayoutIcon";
import ListLayoutIcon from "../../components/Icons/ListLayoutIcon";
import Skeleton from "../../components/Skeleton";

const HomePage: React.FC = () => {
  const [gridLayout, setGridLayout] = React.useState<boolean>(true);
  const dispatch = useDispatch();
  const loadingGist = useSelector((state: RootState) => state.gists.loading);
  const totalPages = useSelector((state: RootState) => state.gists.totalPages);
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
            className="grid-layout-icon-container"
            onClick={() => setGridLayout(true)}
            style={{
              backgroundColor: gridLayout ? "#E3E3E3" : "white",
            }}
          >
            <GridLayoutIcon />
          </div>
          <div
            style={{
              backgroundColor: !gridLayout ? "#E3E3E3" : "white",
            }}
            className="list-layout-icon-container "
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
          of {totalPages}
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
            disabled={page === totalPages}
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
