import React from 'react';
import './GistGridLayout.scss';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../store';
import GistDescription from "../GistDescription";
import CodeOutput from "../CodeOutput";

const GistGridLayout: React.FC = () => {
  const gists = useSelector((state: RootState) => state.gists.value);

  return (
    <div className="gist-grid-layout">
      {gists.map((gist) => (
          <Link key={gist.id} to={`/gist/${gist.id}`}>
            <CodeOutput
              content={gist.files[Object.keys(gist.files)[0]]?.content || ''}
              filename={Object.keys(gist.files)[0]}
              width="half"
              height="half"
              fontSize="0.7rem"
              letterSpacing
              fileLanguage={gist.files[Object.keys(gist.files)[0]]?.language || 'javascript'}
            >
              <div className="border-t border-gray-300 ">
                <GistDescription gist={gist} />
              </div>
            </CodeOutput>
          </Link>
        ))}
    </div>
  );
};

export default GistGridLayout;
