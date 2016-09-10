import React from 'react'
import {saveAs} from 'file-saver'

import { Drawer, Container, Block, Fixed } from 'rebass'
import {Map} from './map.jsx'
import {Toolbar} from './toolbar.jsx'
import { StyleManager } from './style.js'
import { StyleStore } from './stylestore.js'
import { WorkspaceDrawer } from './workspace.jsx'

import theme from './theme.js'
import layout from './layout.scss'

export default class App extends React.Component {
  static childContextTypes = {
    rebass: React.PropTypes.object,
		reactIconBase: React.PropTypes.object
  }

	constructor(props) {
		super(props)
		this.styleStore = new StyleStore()
		this.state = {
			workContext: "layers",
			currentStyle: this.styleStore.latestStyle(),
		}
	}

  getChildContext() {
    return {
			rebass: theme,
			reactIconBase: { size: 20 }
		}
	}

	onStyleDownload() {
		this.styleStore.save(newStyle)
		const mapStyle =  JSON.stringify(this.state.currentStyle.toJS(), null, 4)
		const blob = new Blob([mapStyle], {type: "application/json;charset=utf-8"});
		saveAs(blob, mapStyle.id + ".json");
	}

	onStyleUpload(newStyle) {
		const savedStyle = this.styleStore.save(newStyle)
		this.setState({ currentStyle: savedStyle })
	}

	onStyleChanged(newStyle) {
		this.setState({ currentStyle: newStyle })
	}

	onOpenSettings() {
		this.setState({ workContext: "settings", })
	}

	onOpenLayers() {
		this.setState({ workContext: "layers", })
	}

  render() {
    return <div style={{ fontFamily: theme.fontFamily, color: theme.color, fontWeight: 300 }}>
			<Toolbar
					onStyleUpload={this.onStyleUpload.bind(this)}
					onStyleDownload={this.onStyleDownload.bind(this)}
					onOpenSettings={this.onOpenSettings.bind(this)}
					onOpenLayers={this.onOpenLayers.bind(this)}
			/>
			<WorkspaceDrawer
				onStyleChanged={this.onStyleChanged.bind(this)}
				workContext={this.state.workContext}
				mapStyle={this.state.currentStyle}
			/>
			<div className={layout.map}>
				<Map mapStyle={this.state.currentStyle} />
			</div>
		</div>
  }
}
