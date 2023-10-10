import * as React from 'react';
import {
  AccordionComponent,
  AccordionItemDirective,
  AccordionItemsDirective,
} from '@syncfusion/ej2-react-navigations';
import FloorsFilter from './FloorsFilter';
import PriceFilter from './PriceFilter';
import FeaturesFilter from './FeaturesFilter';
import './Filters.css';

const Filters = () => {
  return (
    <AccordionComponent className="app-filters">
      <AccordionItemsDirective>
        <AccordionItemDirective
          header="Floors"
          content={FloorsFilter}
          expanded={true}
        />
        <AccordionItemDirective header="Price" content={PriceFilter} />
        <AccordionItemDirective header="Features" content={FeaturesFilter} />
      </AccordionItemsDirective>
    </AccordionComponent>
  );
};

export default Filters;
