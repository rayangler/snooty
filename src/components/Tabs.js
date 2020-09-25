import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs } from '@leafygreen-ui/tabs';
import ComponentFactory from './ComponentFactory';
import { TabContext } from './tab-context';
import { reportAnalytics } from '../utils/report-analytics';
import { getNestedValue } from '../utils/get-nested-value';

const getTabId = node => getNestedValue(['options', 'tabid'], node);

// Name anonymous tabsets by alphabetizing their tabids and concatenating with a forward slash
const generateAnonymousTabsetName = tabIds => [...tabIds].sort().join('/');

// Conditionally render contents of hidden tabsets without using LeafyGreen Tab components
const HiddenTabset = ({ tabs, activeTab, ...rest }) => (
  <>
    {tabs.map((tab, i) => {
      const tabId = tab.options.tabid;
      if (activeTab === tabId) {
        return (
          <>
            {tab.children.map((child, j) => (
              <ComponentFactory {...rest} key={`${i}-${j}`} nodeData={child} />
            ))}
          </>
        );
      }
      return null;
    })}
  </>
);

HiddenTabset.propTypes = {
  activeTab: PropTypes.string.isRequired,
  tabs: PropTypes.shape({
    children: PropTypes.shape({
      children: PropTypes.arrayOf(PropTypes.object),
      name: PropTypes.oneOf(['tab']),
      options: PropTypes.shape({
        tabid: PropTypes.string.isRequired,
      }).isRequired,
    }),
  }),
};

const SnootyTabs = ({ nodeData: { children, options = {} }, ...rest }) => {
  const { activeTabs, setActiveTab } = useContext(TabContext);
  const tabIds = children.map(child => getTabId(child));
  const tabsetName = options.tabset || generateAnonymousTabsetName(tabIds);
  const activeTab = activeTabs[tabsetName];
  const isHidden = Object.prototype.hasOwnProperty.call(options, 'hidden');

  useEffect(() => {
    if (!activeTab || !tabIds.includes(activeTab)) {
      // Set first tab as active if no tab was previously selected
      setActiveTab({ name: tabsetName, value: getTabId(children[0]) });
    }
  }, [activeTab, children, setActiveTab, tabIds, tabsetName]);

  const handleClick = index => {
    const tabId = tabIds[index];
    setActiveTab({ name: tabsetName, value: tabId });
    reportAnalytics('Tab Selected', {
      tabId,
      tabSet: tabsetName,
    });
  };

  return (
    <>
      {isHidden ? (
        <HiddenTabset {...rest} tabs={children} activeTab={activeTab} />
      ) : (
        <Tabs setSelected={handleClick} selected={tabIds.indexOf(activeTab)}>
          {children.map(child => {
            const tabId = child.options.tabid;
            const tabTitle =
              child.argument.length > 0
                ? child.argument.map((arg, j) => <ComponentFactory {...rest} key={`arg-${j}`} nodeData={arg} />)
                : tabId;
            return (
              <Tab name={tabTitle} key={tabId}>
                {child.children.map((tab, i) => (
                  <ComponentFactory {...rest} key={`${tabId}-${i}`} nodeData={tab} />
                ))}
              </Tab>
            );
          })}
        </Tabs>
      )}
    </>
  );
};

SnootyTabs.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        argument: PropTypes.arrayOf(PropTypes.object).isRequired,
        children: PropTypes.arrayOf(PropTypes.object),
        name: PropTypes.oneOf(['tab']),
        options: PropTypes.shape({
          tabid: PropTypes.string.isRequired,
        }).isRequired,
      })
    ),
    options: PropTypes.shape({
      hidden: PropTypes.bool,
      tabset: PropTypes.string,
    }),
  }).isRequired,
};

export default SnootyTabs;
