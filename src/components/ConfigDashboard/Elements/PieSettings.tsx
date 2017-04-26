import * as React from 'react';
import * as _ from 'lodash';
import Card from 'react-md/lib/Cards/Card';
import TextField from 'react-md/lib/TextFields';
import FontIcon from 'react-md/lib/FontIcons';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import Switch from 'react-md/lib/SelectionControls/Switch';
import Avatar from 'react-md/lib/Avatars';
import SelectField from 'react-md/lib/SelectFields';

import SettingsActions from '../../../actions/SettingsActions';

interface IPieSettingsProps{
    settings: IElement,
    shouldSave: boolean
}
interface IPieSettingsState{ 
    stateSettings:IElement //we need to persist the changes in state until a save is requested
}

export default class PieSettings extends React.Component<IPieSettingsProps,IPieSettingsState>{
    constructor(props: IPieSettingsProps) {
        super(props);

        this.onParamChange = this.onParamChange.bind(this);
        this.onShowLegendChange = this.onShowLegendChange.bind(this);
        this.componentDidUpdate =  this.componentDidUpdate.bind(this);
        this.onParamSelectChange = this.onParamSelectChange.bind(this);
        this.updateProperty = this.updateProperty.bind(this);
    }
    
    state:IPieSettingsState ={
        stateSettings:this.props.settings
    }
    componentDidUpdate(prevProps, prevState){
        if(this.props.shouldSave){
            this.save();
        }
    }

    save() {

        //tell the parents save ended
        SettingsActions.saveSettingsCompleted();
    }

    onParamChange(value: string, event: any) {
        var s = this.state.stateSettings;
        s[event.target.id] = value;
        this.setState({stateSettings:s});
    }

    onParamSelectChange(newValue: string,newActiveIndex:number, event: any) {
 
           //a little hacking to get the id of the parent, because event does not contain the outer element, but only the inner li
        var s = this.state.stateSettings;
        var cur = event.target;
        while(cur && !cur.classList.contains('ddl')){
            cur = cur.parentNode;
        }
        if(cur) {
            cur = cur.querySelector('input');
            var id = cur.id;
            this.updateProperty(s,id,newValue);
            this.setState({stateSettings:s});
        }
    }
    
    onShowLegendChange(checked:boolean){
        var s = this.state.stateSettings;
        s.props.showLegend = checked;
        this.setState({stateSettings:s});
    }

    updateProperty (object:any, property: string, value: any) {
        let arr = property.split('.');
        let parent: any;
        let key: string;
        while (arr.length && (parent = object) && (key = arr.shift()) && (object = object[key])) { }
        if (parent) {
        parent[key] = value;
        }
    }

    render(){
        var { id, dependencies, actions, props, title, subtitle, size, theme, type } = this.state.stateSettings;
        return(
            <Card>
                <CardTitle title={type} avatar={<Avatar icon={<FontIcon>pie_chart</FontIcon>} />}/>
                  <div className="md-grid">
                        <TextField
                            id="id"
                            label="Id"
                            placeholder="id"
                            leftIcon={<FontIcon>settings</FontIcon>}
                            className="md-cell md-cell--bottom"
                            value={id}
                            onChange={this.onParamChange}
                            />
                        <TextField
                            id="title"
                            label="Title"
                            placeholder="title"
                            leftIcon={<FontIcon>title</FontIcon>}
                            className="md-cell md-cell--bottom"
                            value={title}
                            onChange={this.onParamChange}
                            />
                        <TextField
                            id="subtitle"
                            label="Subtitle"
                            placeholder="subtitle"
                            leftIcon={<FontIcon>text_fields</FontIcon>}
                            className="md-cell md-cell--bottom"
                            value={subtitle}
                            onChange={this.onParamChange}
                            />
                        <div className="md-cell md-cell--bottom">
                            <div className="md-grid">
                                
                                <SelectField
                                    id="size.w"
                                    name="size.w"
                                    label="Width"
                                    defaultValue="1"
                                    menuItems={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
                                    onChange={this.onParamSelectChange}
                                    className="md-cell md-cell--bottom ddl"
                                    value={size.w}
                                    />
                                <SelectField
                                    id="size.h"
                                    name="size.h"
                                    label="Width"
                                    defaultValue="1"
                                    menuItems={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
                                    onChange={this.onParamSelectChange}
                                    className="md-cell md-cell--bottom ddl"
                                    value={size.h}
                                    />
                                
                            </div>
                        </div>
                        <span className="md-cell md-cell--bottom">
                            <div className="md-grid">
                                <span className="md-cell--1 md-cell--middle"><FontIcon>insert_chart</FontIcon></span>
                                <span className="md-cell--11 md-cell--bottom"><Switch id="props.showLegend" name="props.showLegend" label="Show legend" checked={props.showLegend} onChange={this.onShowLegendChange} /></span>
                            </div>
                        </span>
                    </div>
            </Card>
        );
    }
}