import { CodeOutlined } from '@ant-design/icons';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './CodeUutput.scss';

interface CodeOutputProps {
  filename: string;
  content: string;
  width: 'full' | 'half';
  height: 'full' | 'half';
  codeIcon?: boolean;
  fontSize: string;
  letterSpacing?: boolean;
  lineNumberMargin?: boolean;
  children?: React.ReactNode;
  fileLanguage: string;
  disableOverlay?: boolean;
}

const index: React.FC<CodeOutputProps> = ({
  content,
  filename,
  height,
  width,
  fontSize,
  codeIcon,
  letterSpacing,
  children,
  lineNumberMargin,
  fileLanguage,
  disableOverlay,
}) => (
    <div
        className={`border ${height === 'full' ? 'h-full' : 'h-80'} ${
          width === 'full' ? 'w-full' : 'w-96'
        } border-gray-200 rounded-lg shadow overflow-hidden flex justify-between flex-col`}
      >
        {codeIcon && (
          <div className="border-b border-gray-200 px-3 py-2 flex justify-start items-center">
            <CodeOutlined />
            <span className="text-xs font-bold ml-2 text-blue-600">{filename}</span>
          </div>
        )}
        <div className="border border-gray-200 hover:border-black h-full w-full rounded-lg p-[1px] relative code-container">
          <SyntaxHighlighter
            customStyle={{
              width: '100%',
              height: '100%',
              fontSize,
              fontWeight: 'bold',
              padding: '10px',
              overflow: 'hidden',
              margin: '0px',
              letterSpacing: letterSpacing ? '0.1px' : '0px',
            }}
            lineNumberStyle={{
              color: 'lightgray',
              marginLeft: lineNumberMargin ? '30px' : '0px',
            }}
            showLineNumbers
            language={fileLanguage?.toLocaleLowerCase() || 'javascript'}
            style={oneLight}
          >
            {content}
          </SyntaxHighlighter>
          {!disableOverlay && (
            <div className="overlay">
              View <span>{filename}</span>
            </div>
          )}
        </div>
        {children}
      </div>
  );

export default index;
