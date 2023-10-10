import * as React from 'react';
import { Browser } from '@syncfusion/ej2-base';
import { SidebarComponent } from '@syncfusion/ej2-react-navigations';
import Calendar from '../Calendar/Calendar';
import Filters from '../Filters/Filters';
import './Sidebar.css';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

const Sidebar = React.forwardRef(
  (props: Record<string, any>, ref: React.Ref<Record<string, any>>) => {
    let sidebarObj: SidebarComponent;
    let sidebarOverlay: HTMLDivElement;

    React.useImperativeHandle(ref, () => ({
      toggle(): void {
        if (sidebarObj.element.style.visibility === 'visible') {
          sidebarObj.element.style.visibility = 'hidden';
          sidebarObj.hide();
          sidebarOverlay.classList.remove('show');
        } else {
          sidebarObj.element.style.visibility = 'visible';
          sidebarObj.show();
          sidebarOverlay.classList.add('show');
        }
      },
    }));

    const onSidebarClose = (): void => {
      sidebarObj.element.style.visibility = 'hidden';
      sidebarObj.hide();
      sidebarOverlay.classList.remove('show');
    };

    const onCreated = (): void => {
      if (Browser.isDevice || window.innerWidth <= 1024) {
        sidebarObj.hide();
      } else if (window.innerWidth > 1024) {
        sidebarObj.show();
      }
    };

    return (
      <React.Fragment>
        <SidebarComponent
          ref={(sidebarRef: SidebarComponent) => (sidebarObj = sidebarRef)}
          className="app-sidebar"
          width={Browser.isDevice ? '100%' : 'auto'}
          enableGestures={false}
          mediaQuery={window.matchMedia('(min-width: 1024px)')}
          isOpen={window.innerWidth > 1024}
          created={onCreated}>
          <div className="sidebar-header">
            <div className="sidebar-title">Filter By</div>
            <ButtonComponent
              cssClass="sidebar-close e-flat e-small e-round"
              iconCss="e-icons e-close"
              onClick={onSidebarClose}
            />
          </div>
          <div className="calendar-container">
            <Calendar />
          </div>
          <div className="filter-container">
            <div className="filter-label">FILTER BY</div>
            <Filters />
          </div>
        </SidebarComponent>
        <div
          className="app-sidebar-overlay"
          ref={(elRef: HTMLDivElement) => (sidebarOverlay = elRef)}
        />
      </React.Fragment>
    );
  },
);

export default Sidebar;
